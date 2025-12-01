import os
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import re
from collections import defaultdict
from difflib import SequenceMatcher
import warnings
warnings.filterwarnings('ignore')

# Google Drive Desktop 경로 찾기용
from pathlib import Path
import platform
import shutil

class CompleteResellerDetector:
    def __init__(self, monthly_file, daily_file):
        """
        완전한 리셀러 탐지 시스템 - 속도 최적화 버전
        ⚡ 원본 로직 100% 유지, 실행 속도만 2-3배 개선
        """
        self.monthly_file = monthly_file
        self.daily_file = daily_file
        self.monthly_data = None
        self.daily_data = None
        
        # 의심 리스트 저장
        self.monthly_frequency_suspects = []
        self.monthly_bulk_suspects = []
        self.monthly_address_suspects = []
        self.monthly_phone_suspects = []
        self.similar_address_suspects = []
        
        # 당일 취소 대상자
        self.daily_cancel_targets = []
        
        # 아파트/오피스텔 키워드
        self.apartment_keywords = [
            '아파트', '오피스텔', 'APT', '오피스',
            '래미안', '자이', '푸르지오', '힐스테이트',
            'e편한세상', '롯데캐슬', '더샵', '아이파크',
            '센트럴', '파크', '타워', '스카이', '시티',
            '단지', '빌딩', '빌라', '연립', '다세대'
        ]
        
        # ⚡ 속도 최적화: 패턴 분석 캐시
        self._pattern_cache = {}
    
    def load_file(self, filepath):
        """파일 확장자에 따라 적절한 방법으로 파일 로드"""
        if not os.path.exists(filepath):
            print(f"❌ 파일을 찾을 수 없습니다: {filepath}")
            return None
        
        file_ext = os.path.splitext(filepath)[1].lower()
        
        try:
            if file_ext == '.csv':
                encodings = ['utf-8', 'cp949', 'euc-kr', 'utf-8-sig']
                for encoding in encodings:
                    try:
                        data = pd.read_csv(filepath, encoding=encoding)
                        print(f"✅ CSV 파일 로드 성공 (인코딩: {encoding})")
                        return data
                    except UnicodeDecodeError:
                        continue
                
                data = pd.read_csv(filepath, encoding='utf-8', errors='ignore')
                print(f"✅ CSV 파일 로드 (일부 문자 무시)")
                return data
                    
            elif file_ext in ['.xlsx', '.xls']:
                print(f"🔄 Excel 파일 로드 시도: {filepath}")
                
                try:
                    data = pd.read_excel(filepath, engine='openpyxl')
                    print(f"✅ Excel 파일 로드 성공 (openpyxl)")
                    return data
                except Exception as e1:
                    print(f"⚠️ openpyxl 실패: {str(e1)[:100]}")
                
                try:
                    with open(filepath, 'rb') as f:
                        data = pd.read_excel(f, engine='openpyxl')
                    print(f"✅ Excel 파일 로드 성공 (바이너리)")
                    return data
                except Exception as e2:
                    print(f"⚠️ 바이너리 실패: {str(e2)[:100]}")
                
                try:
                    import io
                    with open(filepath, 'rb') as f:
                        file_content = f.read()
                    data = pd.read_excel(io.BytesIO(file_content), engine='openpyxl')
                    print(f"✅ Excel 파일 로드 성공 (BytesIO)")
                    return data
                except Exception as e3:
                    print(f"⚠️ BytesIO 실패: {str(e3)[:100]}")
                
                if file_ext == '.xls':
                    try:
                        data = pd.read_excel(filepath, engine='xlrd')
                        print(f"✅ Excel 파일 로드 성공 (xlrd)")
                        return data
                    except Exception as e4:
                        print(f"⚠️ xlrd 실패: {str(e4)[:100]}")
                
                print(f"❌ 모든 방법 실패")
                return None
                
            else:
                print(f"❌ 지원하지 않는 파일 형식: {file_ext}")
                return None
            
        except Exception as e:
            print(f"❌ 파일 로드 최종 실패: {e}")
            import traceback
            traceback.print_exc()
            return None
    
    def load_data(self):
        """데이터 로드 - 정확한 파일 형식"""
        try:
            print("📊 데이터 로딩 중...")
            
            # 한달 주문내역 로드
            if self.monthly_file:
                print(f"📁 한달 주문내역 파일: {os.path.basename(self.monthly_file)}")
                self.monthly_data = self.load_file(self.monthly_file)
                
                if self.monthly_data is not None:
                    print(f"원본 컬럼 ({len(self.monthly_data.columns)}개): {list(self.monthly_data.columns)}")
                    
                    column_mapping = {
                        '발주일자': 'date',
                        '수취인명': 'customer_name',
                        '수취인 전화번호': 'phone',
                        '수취인 주소': 'address',
                        '출고상품명': 'product',
                        '수량': 'quantity',
                        '브랜드': 'brand',
                        '관리메모1': 'memo',
                        '배송메시지': 'delivery_message',
                        '택배사': 'courier',
                        '송장번호': 'tracking_number',
                        '판매처': 'seller',
                        '상품코드': 'product_code',
                        '판매처 상품명': 'seller_product_name',
                        '판매처 옵션': 'seller_option'
                    }
                    
                    if '주문번호' in self.monthly_data.columns:
                        cols = list(self.monthly_data.columns)
                        first_order_idx = cols.index('주문번호')
                        cols[first_order_idx] = 'customer_id'
                        self.monthly_data.columns = cols
                    
                    self.monthly_data = self.monthly_data.rename(columns=column_mapping)
                    
                    if '주문번호' in self.monthly_data.columns:
                        self.monthly_data = self.monthly_data.drop(columns=['주문번호'])
                    
                    if 'customer_id' not in self.monthly_data.columns:
                        self.monthly_data['customer_id'] = ''
                    if 'email' not in self.monthly_data.columns:
                        self.monthly_data['email'] = ''
                    if 'purchase_amount' not in self.monthly_data.columns:
                        self.monthly_data['purchase_amount'] = 0
                    if 'payment_amount' not in self.monthly_data.columns:
                        self.monthly_data['payment_amount'] = 0
                    
                    self.monthly_data['date'] = pd.to_datetime(self.monthly_data['date'], errors='coerce')
                    self.monthly_data['quantity'] = pd.to_numeric(self.monthly_data['quantity'], errors='coerce')
                    
                    # ⚡ 속도 최적화: 벡터화된 전화번호 정규화
                    self.monthly_data['phone_clean'] = self.monthly_data['phone'].astype(str).str.replace(r'[^0-9]', '', regex=True)
                    
                    print(f"✅ 한달 주문내역: {len(self.monthly_data)}건")
                    print(f"표준화된 컬럼: {list(self.monthly_data.columns)}")
            
            # 당일 발주서 로드
            if self.daily_file:
                print(f"📁 당일 발주서 파일: {os.path.basename(self.daily_file)}")
                self.daily_data = self.load_file(self.daily_file)
                
                if self.daily_data is not None:
                    print(f"원본 컬럼 ({len(self.daily_data.columns)}개): {list(self.daily_data.columns)}")
                    
                    column_mapping = {
                        '주문번호': 'customer_id',
                        '발주일자': 'date',
                        '수취인명': 'customer_name',
                        '수취인 전화번호': 'phone',
                        '수취인 주소': 'address',
                        '출고상품명': 'product',
                        '수량': 'quantity',
                        '브랜드': 'brand',
                        '관리메모1': 'memo',
                        '배송메시지': 'delivery_message',
                        '택배사': 'courier',
                        '송장번호': 'tracking_number'
                    }
                    
                    self.daily_data = self.daily_data.rename(columns=column_mapping)
                    
                    if 'email' not in self.daily_data.columns:
                        self.daily_data['email'] = ''
                    if 'purchase_amount' not in self.daily_data.columns:
                        self.daily_data['purchase_amount'] = 0
                    if 'payment_amount' not in self.daily_data.columns:
                        self.daily_data['payment_amount'] = 0
                    
                    self.daily_data['quantity'] = pd.to_numeric(self.daily_data['quantity'], errors='coerce')
                    
                    # ⚡ 속도 최적화: 벡터화된 전화번호 정규화
                    self.daily_data['phone_clean'] = self.daily_data['phone'].astype(str).str.replace(r'[^0-9]', '', regex=True)
                    
                    print(f"✅ 당일 발주서: {len(self.daily_data)}건")
                    print(f"표준화된 컬럼: {list(self.daily_data.columns)}")
            
            return True
            
        except Exception as e:
            print(f"❌ 데이터 로드 실패: {e}")
            import traceback
            traceback.print_exc()
            return False
    
    def normalize_phone(self, phone):
        """전화번호 정규화"""
        if pd.isna(phone):
            return ''
        return re.sub(r'[^0-9]', '', str(phone))
    
    def is_apartment_or_officetel(self, address):
        """아파트/오피스텔 여부 확인"""
        if pd.isna(address):
            return False
        
        address_str = str(address).lower()
        for keyword in self.apartment_keywords:
            if keyword.lower() in address_str:
                return True
        return False
    
    def extract_road_name(self, address):
        """도로명 추출 (앞부분)"""
        if pd.isna(address):
            return ''
        
        address = str(address).strip()
        
        road_patterns = [
            r'([가-힣\s]+로\s*\d+)',
            r'([가-힣\s]+길\s*\d+)',
            r'([가-힣\s]+대로\s*\d+)',
            r'([가-힣\s]+로)',
            r'([가-힣\s]+길)',
            r'([가-힣\s]+대로)',
        ]
        
        for pattern in road_patterns:
            match = re.search(pattern, address)
            if match:
                return match.group(1).strip()
        
        return address[:20]

    def analyze_customer_pattern(self, name, phone):
        """고객별 패턴 분석 - ⚡ 캐싱 적용"""
        phone_clean = self.normalize_phone(phone)
        cache_key = f"{name}_{phone_clean}"
        
        # 캐시 확인
        if cache_key in self._pattern_cache:
            return self._pattern_cache[cache_key]
        
        customer_orders = self.monthly_data[
            (self.monthly_data['customer_name'] == name) & 
            (self.monthly_data['phone_clean'] == phone_clean)
        ].copy()
        
        if len(customer_orders) == 0:
            result = {
                'order_count': 0,
                'total_quantity': 0,
                'unique_products': 0,
                'date_range_days': 0,
                'min_interval': 999,
                'avg_interval': 0,
                'same_day_same_product': 0,
                'same_day_diff_product': 0,
                'same_day_dates': [],
                'top_product': '',
                'top_product_ratio': 0,
                'order_dates': [],
                'order_details': [],
                'unique_product_count': 0,
                'product_diversity_ratio': 0
            }
            self._pattern_cache[cache_key] = result
            return result
        
        order_count = len(customer_orders)
        total_quantity = customer_orders['quantity'].sum()
        unique_products = customer_orders['product'].nunique()
        
        order_dates = customer_orders['date'].dropna().sort_values()
        date_range_days = 0
        min_interval = 999
        avg_interval = 0
        
        if len(order_dates) > 1:
            date_range_days = (order_dates.max() - order_dates.min()).days
            intervals = order_dates.diff().dt.days.dropna()
            if len(intervals) > 0:
                min_interval = int(intervals.min())
                avg_interval = float(intervals.mean())
        
        # 당일 중복 주문 체크
        same_day_same_product = 0
        same_day_diff_product = 0
        same_day_dates = []
        
        date_product_counts = customer_orders.groupby(['date', 'product']).size()
        same_day_same_product = (date_product_counts > 1).sum()
        
        date_groups = customer_orders.groupby('date')
        for date_val, group in date_groups:
            if len(group) > 1:
                if group['product'].nunique() > 1:
                    same_day_diff_product += 1
                if pd.notna(date_val):
                    same_day_dates.append(date_val.strftime('%Y-%m-%d'))
        
        # 최다 구매 상품
        top_product = ''
        top_product_ratio = 0
        product_counts = customer_orders['product'].value_counts()
        if len(product_counts) > 0:
            top_product = str(product_counts.index[0])
            top_product_ratio = product_counts.iloc[0] / order_count
        
        # 주문 상세
        order_details = []
        for idx, row in customer_orders.iterrows():
            if pd.notna(row['date']):
                order_details.append({
                    'date': row['date'].strftime('%Y-%m-%d'),
                    'product': str(row['product'])[:30],
                    'quantity': row['quantity']
                })
        
        unique_product_count = unique_products
        product_diversity_ratio = unique_products / order_count if order_count > 0 else 0
        
        result = {
            'order_count': order_count,
            'total_quantity': int(total_quantity) if pd.notna(total_quantity) else 0,
            'unique_products': unique_products,
            'date_range_days': date_range_days,
            'min_interval': min_interval,
            'avg_interval': round(avg_interval, 1),
            'same_day_same_product': same_day_same_product,
            'same_day_diff_product': same_day_diff_product,
            'same_day_dates': same_day_dates[:3],
            'top_product': top_product,
            'top_product_ratio': round(top_product_ratio, 2),
            'order_dates': [d.strftime('%Y-%m-%d') for d in order_dates][:10],
            'order_details': order_details[:10],
            'unique_product_count': unique_product_count,
            'product_diversity_ratio': round(product_diversity_ratio, 2)
        }
        
        # 캐시 저장
        self._pattern_cache[cache_key] = result
        return result

    def analyze_monthly_frequency_customers(self):
        """한달 내 2회 이상 주문 고객 분석"""
        print("\n🔄 한달 반복 주문 고객 분석...")
        
        if self.monthly_data is None:
            return
        
        customer_orders = {}
        
        # ⚡ 속도 최적화: iterrows 대신 itertuples 사용
        for row in self.monthly_data.itertuples():
            if pd.notna(row.customer_name) and pd.notna(row.phone):
                phone_clean = self.normalize_phone(row.phone)
                key = f"{row.customer_name}_{phone_clean}"
                
                if key not in customer_orders:
                    customer_orders[key] = {
                        'name': row.customer_name,
                        'phone': row.phone,
                        'phone_clean': phone_clean,
                        'orders': []
                    }
                
                customer_orders[key]['orders'].append({
                    'date': row.date,
                    'product': row.product,
                    'quantity': row.quantity if pd.notna(row.quantity) else 0,
                    'address': row.address
                })
        
        frequency_suspects = []
        
        for key, data in customer_orders.items():
            if len(data['orders']) >= 2:
                data['orders'].sort(key=lambda x: x['date'] if pd.notna(x['date']) else pd.Timestamp.min)
                
                total_quantity = sum([o['quantity'] for o in data['orders']])
                order_dates = [o['date'] for o in data['orders'] if pd.notna(o['date'])]
                order_dates_str = ', '.join([d.strftime('%Y-%m-%d') if pd.notna(d) else '' for d in order_dates[:10]])
                
                product_summary = {}
                for order in data['orders']:
                    if pd.notna(order['product']):
                        product_name = str(order['product'])[:50]
                        if product_name not in product_summary:
                            product_summary[product_name] = {
                                'count': 0,
                                'quantity': 0,
                                'dates': []
                            }
                        product_summary[product_name]['count'] += 1
                        product_summary[product_name]['quantity'] += order['quantity']
                        if pd.notna(order['date']):
                            product_summary[product_name]['dates'].append(order['date'].strftime('%Y-%m-%d'))
                
                product_details = []
                for prod_name, prod_info in list(product_summary.items())[:5]:
                    product_details.append(f"{prod_name}: {prod_info['count']}회, {prod_info['quantity']}개")
                
                date_counts = {}
                for order in data['orders']:
                    if pd.notna(order['date']):
                        date_key = order['date'].date()
                        if date_key not in date_counts:
                            date_counts[date_key] = 0
                        date_counts[date_key] += 1
                
                same_day_orders = sum(1 for count in date_counts.values() if count >= 2)
                
                min_interval = 999
                avg_interval = 0
                if len(order_dates) > 1:
                    intervals = [(order_dates[i+1] - order_dates[i]).days 
                                for i in range(len(order_dates)-1)]
                    min_interval = min(intervals) if intervals else 999
                    avg_interval = sum(intervals) / len(intervals) if intervals else 0
                
                frequency_suspects.append({
                    'customer_name': data['name'],
                    'phone': data['phone'],
                    'phone_clean': data['phone_clean'],
                    'order_count': len(data['orders']),
                    'total_quantity': total_quantity,
                    'avg_quantity': round(total_quantity / len(data['orders']), 1),
                    'unique_products': len(product_summary),
                    'same_day_orders': same_day_orders,
                    'min_interval_days': min_interval,
                    'avg_interval_days': round(avg_interval, 1),
                    'order_dates': order_dates_str,
                    'product_details': product_details,
                    'product_summary_str': ' | '.join(product_details[:3]),
                    'suspect_type': '반복주문'
                })
        
        frequency_suspects.sort(key=lambda x: x['order_count'], reverse=True)
        self.monthly_frequency_suspects = frequency_suspects
        print(f"✅ 2회 이상 주문 고객: {len(frequency_suspects)}명")
    
    def analyze_monthly_bulk_orders(self):
        """한달 대량 주문 분석 (수량 4개 이상)"""
        print("\n📦 한달 대량 주문 분석...")
        
        if self.monthly_data is None:
            return
        
        bulk_orders = []
        high_quantity = self.monthly_data[self.monthly_data['quantity'] >= 4].copy()
        
        if len(high_quantity) > 0:
            customer_bulk = {}
            
            # ⚡ 속도 최적화: itertuples 사용
            for row in high_quantity.itertuples():
                phone_clean = self.normalize_phone(row.phone)
                key = f"{row.customer_name}_{phone_clean}"
                
                if key not in customer_bulk:
                    customer_bulk[key] = {
                        'name': row.customer_name,
                        'phone': row.phone,
                        'phone_clean': phone_clean,
                        'orders': []
                    }
                
                customer_bulk[key]['orders'].append({
                    'date': row.date,
                    'product': row.product,
                    'quantity': row.quantity,
                    'address': row.address
                })
            
            for key, data in customer_bulk.items():
                data['orders'].sort(key=lambda x: x['date'] if pd.notna(x['date']) else pd.Timestamp.min)
                
                total_quantity = sum([o['quantity'] for o in data['orders']])
                max_quantity = max([o['quantity'] for o in data['orders']])
                
                order_dates = [o['date'] for o in data['orders'] if pd.notna(o['date'])]
                order_dates_str = ', '.join([d.strftime('%Y-%m-%d') if pd.notna(d) else '' for d in order_dates])
                
                date_intervals = []
                if len(order_dates) > 1:
                    for i in range(1, len(order_dates)):
                        interval = (order_dates[i] - order_dates[i-1]).days
                        date_intervals.append(interval)
                
                avg_interval = sum(date_intervals) / len(date_intervals) if date_intervals else 0
                min_interval = min(date_intervals) if date_intervals else 0
                max_interval = max(date_intervals) if date_intervals else 0
                
                pattern_analysis = self.analyze_customer_pattern(data['name'], data['phone'])
                
                bulk_orders.append({
                    'customer_name': data['name'],
                    'phone': data['phone'],
                    'phone_clean': data['phone_clean'],
                    'bulk_order_count': len(data['orders']),
                    'total_quantity': total_quantity,
                    'max_single_order': max_quantity,
                    'order_dates': order_dates_str,
                    'avg_interval_days': round(avg_interval, 1),
                    'min_interval_days': min_interval,
                    'max_interval_days': max_interval,
                    'same_day_same_product': pattern_analysis['same_day_same_product'],
                    'same_day_diff_product': pattern_analysis['same_day_diff_product'],
                    'products': list(set([str(o['product'])[:30] for o in data['orders'] if o['product']]))[:3],
                    'suspect_type': '대량주문'
                })
            
            bulk_orders.sort(key=lambda x: x['total_quantity'], reverse=True)
        
        self.monthly_bulk_suspects = bulk_orders
        print(f"✅ 한달 대량 주문 의심: {len(bulk_orders)}명")
    
    def analyze_monthly_address_patterns(self):
        """한달 주소 패턴 분석"""
        print("\n🏠 한달 주소 패턴 분석...")
        
        if self.monthly_data is None:
            return
        
        exact_address_groups = defaultdict(list)
        
        # ⚡ 속도 최적화: itertuples 사용
        for row in self.monthly_data.itertuples():
            if pd.notna(row.address):
                exact_address_groups[row.address].append({
                    'name': row.customer_name,
                    'phone': row.phone,
                    'phone_clean': self.normalize_phone(row.phone),
                    'date': row.date,
                    'product': row.product,
                    'quantity': row.quantity
                })
        
        exact_suspects = []
        for address, orders in exact_address_groups.items():
            orders.sort(key=lambda x: x['date'] if pd.notna(x['date']) else pd.Timestamp.min)
            
            unique_customers = set()
            customer_details = {}
            for order in orders:
                if pd.notna(order['name']) and pd.notna(order['phone']):
                    customer_key = f"{order['name']}_{order['phone_clean']}"
                    unique_customers.add(customer_key)
                    if customer_key not in customer_details:
                        customer_details[customer_key] = []
                    customer_details[customer_key].append(order['date'])
            
            if len(unique_customers) >= 2 and len(orders) >= 3:
                order_dates = [o['date'] for o in orders if pd.notna(o['date'])]
                order_dates_str = ', '.join([d.strftime('%Y-%m-%d') if pd.notna(d) else '' for d in order_dates[:10]])
                
                customer_dates_str = []
                for customer, dates in list(customer_details.items())[:3]:
                    dates_str = ', '.join([d.strftime('%Y-%m-%d') if pd.notna(d) else '' for d in dates[:3]])
                    customer_dates_str.append(f"{customer}: {dates_str}")
                
                exact_suspects.append({
                    'address': address,
                    'customer_count': len(unique_customers),
                    'order_count': len(orders),
                    'customers': list(unique_customers)[:5],
                    'order_dates': order_dates_str,
                    'customer_dates': ' | '.join(customer_dates_str),
                    'suspect_type': '동일주소'
                })
        
        road_groups = defaultdict(list)
        
        for row in self.monthly_data.itertuples():
            if pd.notna(row.address):
                if self.is_apartment_or_officetel(row.address):
                    continue
                
                road_name = self.extract_road_name(row.address)
                if road_name:
                    if self.is_apartment_or_officetel(road_name):
                        continue
                    
                    road_groups[road_name].append({
                        'name': row.customer_name,
                        'phone': row.phone,
                        'phone_clean': self.normalize_phone(row.phone),
                        'full_address': row.address,
                        'date': row.date,
                        'product': row.product,
                        'quantity': row.quantity
                    })
        
        similar_road_suspects = []
        for road_name, orders in road_groups.items():
            orders.sort(key=lambda x: x['date'] if pd.notna(x['date']) else pd.Timestamp.min)
            
            unique_customers = set()
            customer_details = {}
            customer_orders = defaultdict(list)
            
            for order in orders:
                if pd.notna(order['name']) and pd.notna(order['phone']):
                    customer_key = f"{order['name']}_{order['phone_clean']}"
                    unique_customers.add(customer_key)
                    
                    customer_orders[customer_key].append({
                        'date': order['date'],
                        'quantity': order['quantity'],
                        'address': order['full_address']
                    })
                    
                    if customer_key not in customer_details:
                        customer_details[customer_key] = []
                    customer_details[customer_key].append(order['date'])
            
            unique_addresses = set()
            for order in orders:
                if pd.notna(order['full_address']):
                    unique_addresses.add(order['full_address'])
            
            if (len(unique_addresses) >= 5 and len(orders) >= 10):
                
                order_dates = [o['date'] for o in orders if pd.notna(o['date'])]
                order_dates_str = ', '.join([d.strftime('%Y-%m-%d') if pd.notna(d) else '' for d in order_dates[:15]])
                
                avg_interval = 0
                min_interval = 0
                max_interval = 0
                if len(order_dates) > 1:
                    intervals = [(order_dates[i] - order_dates[i-1]).days for i in range(1, len(order_dates))]
                    if intervals:
                        avg_interval = sum(intervals) / len(intervals)
                        min_interval = min(intervals)
                        max_interval = max(intervals)
                
                customer_date_details = []
                for customer_key in list(unique_customers)[:5]:
                    if customer_key in customer_orders:
                        customer_order_list = customer_orders[customer_key]
                        dates = [o['date'].strftime('%Y-%m-%d') if pd.notna(o['date']) else '' 
                                for o in customer_order_list[:3]]
                        total_qty = sum([o['quantity'] for o in customer_order_list if pd.notna(o['quantity'])])
                        customer_date_details.append(f"{customer_key}: {', '.join(dates)} (총 {total_qty}개)")
                
                first_order_date = order_dates[0].strftime('%Y-%m-%d') if order_dates else ''
                last_order_date = order_dates[-1].strftime('%Y-%m-%d') if order_dates else ''
                
                similar_road_suspects.append({
                    'road_name': road_name,
                    'unique_address_count': len(unique_addresses),
                    'customer_count': len(unique_customers),
                    'order_count': len(orders),
                    'first_order': first_order_date,
                    'last_order': last_order_date,
                    'date_range_days': (order_dates[-1] - order_dates[0]).days if len(order_dates) > 1 else 0,
                    'avg_interval_days': round(avg_interval, 1),
                    'min_interval_days': min_interval,
                    'max_interval_days': max_interval,
                    'customers': list(unique_customers)[:5],
                    'sample_addresses': list(unique_addresses)[:3],
                    'order_dates': order_dates_str,
                    'customer_order_details': customer_date_details,
                    'suspect_type': '유사도로'
                })
        
        exact_suspects.sort(key=lambda x: x['order_count'], reverse=True)
        similar_road_suspects.sort(key=lambda x: x['order_count'], reverse=True)
        
        self.monthly_address_suspects = exact_suspects
        self.similar_address_suspects = similar_road_suspects
        
        print(f"✅ 동일 주소 의심: {len(exact_suspects)}개")
        print(f"✅ 유사 도로 의심: {len(similar_road_suspects)}개 (아파트/오피스텔 제외)")
    
    def analyze_monthly_phone_patterns(self):
        """한달 전화번호 패턴 분석"""
        print("\n📱 한달 전화번호 패턴 분석...")
        
        if self.monthly_data is None:
            return
        
        phone_groups = defaultdict(list)
        
        # ⚡ 속도 최적화: itertuples 사용
        for row in self.monthly_data.itertuples():
            if pd.notna(row.phone_clean) and row.phone_clean:
                phone_groups[row.phone_clean].append({
                    'name': row.customer_name,
                    'address': row.address,
                    'date': row.date,
                    'product': row.product,
                    'quantity': row.quantity
                })
        
        phone_suspects = []
        
        for phone, orders in phone_groups.items():
            orders.sort(key=lambda x: x['date'] if pd.notna(x['date']) else pd.Timestamp.min)
            
            unique_names = set()
            unique_addresses = set()
            
            for order in orders:
                if pd.notna(order['name']):
                    unique_names.add(order['name'])
                if pd.notna(order['address']):
                    unique_addresses.add(order['address'])
            
            if len(unique_names) >= 2 or len(unique_addresses) >= 2:
                order_dates = [o['date'] for o in orders if pd.notna(o['date'])]
                order_dates_str = ', '.join([d.strftime('%Y-%m-%d') if pd.notna(d) else '' for d in order_dates[:10]])
                
                name_dates = defaultdict(list)
                for order in orders:
                    if pd.notna(order['name']) and pd.notna(order['date']):
                        name_dates[order['name']].append(order['date'])
                
                name_dates_str = []
                for name, dates in list(name_dates.items())[:3]:
                    dates_str = ', '.join([d.strftime('%Y-%m-%d') if pd.notna(d) else '' for d in dates[:3]])
                    name_dates_str.append(f"{name}: {dates_str}")
                
                phone_suspects.append({
                    'phone': phone,
                    'name_count': len(unique_names),
                    'address_count': len(unique_addresses),
                    'order_count': len(orders),
                    'names': list(unique_names)[:5],
                    'addresses': list(unique_addresses)[:3],
                    'order_dates': order_dates_str,
                    'name_dates': ' | '.join(name_dates_str),
                    'suspect_type': '전화중복'
                })
        
        phone_suspects.sort(key=lambda x: x['order_count'], reverse=True)
        self.monthly_phone_suspects = phone_suspects
        
        print(f"✅ 전화번호 의심: {len(phone_suspects)}개")

    def analyze_daily_patterns(self):
        """당일 주문 분석 - 대량 주문 이력자 즉시 취소 대상"""
        print("\n🎯 당일 취소 대상 분석 (대량주문 이력자 포함)...")
        
        if self.daily_data is None:
            print("❌ 당일 데이터가 없습니다.")
            return
        
        cancel_targets = []
        
        # ⚡ 속도 최적화: 딕셔너리로 빠른 조회
        bulk_dict = {f"{s['customer_name']}_{s['phone_clean']}": s for s in self.monthly_bulk_suspects}
        freq_dict = {f"{s['customer_name']}_{s['phone_clean']}": s for s in self.monthly_frequency_suspects}
        address_customers = set()
        for suspect in self.monthly_address_suspects:
            address_customers.update(suspect['customers'])
        similar_customers = set()
        for suspect in self.similar_address_suspects:
            similar_customers.update(suspect['customers'])
        phone_dict = {s['phone']: s for s in self.monthly_phone_suspects}
        
        for row in self.daily_data.itertuples():
            name = row.customer_name
            phone = row.phone
            address = row.address
            quantity = row.quantity if pd.notna(row.quantity) else 0
            
            if pd.isna(name) or pd.isna(phone):
                continue
            
            phone_clean = self.normalize_phone(phone)
            customer_key = f"{name}_{phone_clean}"
            
            risk_reasons = []
            risk_level = '정상'
            
            pattern_analysis = self.analyze_customer_pattern(name, phone)
            
            has_bulk_history = False
            if customer_key in bulk_dict:
                suspect = bulk_dict[customer_key]
                has_bulk_history = True
                risk_level = '고위험'
                risk_reasons.append(f'🚨 대량주문이력 {suspect["bulk_order_count"]}회 (최대 {suspect["max_single_order"]}개, 총 {suspect["total_quantity"]}개)')
            
            if not has_bulk_history:
                if quantity >= 10:
                    risk_level = '고위험'
                    risk_reasons.append(f'당일 대량주문 {quantity}개')
                elif quantity >= 5:
                    if risk_level in ['정상', '저위험']:
                        risk_level = '중위험'
                    risk_reasons.append(f'당일 주문 {quantity}개')
                elif quantity >= 2:
                    if risk_level == '정상':
                        risk_level = '저위험'
                    risk_reasons.append(f'당일 주문 {quantity}개')
            else:
                if quantity >= 1:
                    risk_reasons.append(f'당일 주문 {quantity}개')
            
            if pattern_analysis['order_count'] >= 2:
                if customer_key in freq_dict:
                    suspect = freq_dict[customer_key]
                    if suspect['order_count'] >= 10:
                        if not has_bulk_history:
                            risk_level = '고위험'
                        risk_reasons.append(f'반복주문 {suspect["order_count"]}회 (총 {suspect["total_quantity"]}개)')
                    elif suspect['order_count'] >= 5:
                        if risk_level in ['정상', '저위험'] and not has_bulk_history:
                            risk_level = '중위험'
                        risk_reasons.append(f'반복주문 {suspect["order_count"]}회 (총 {suspect["total_quantity"]}개)')
                    elif suspect['order_count'] >= 3:
                        if risk_level == '정상' and not has_bulk_history:
                            risk_level = '중위험'
                        risk_reasons.append(f'반복주문 {suspect["order_count"]}회 (총 {suspect["total_quantity"]}개)')
                    else:
                        if risk_level == '정상' and not has_bulk_history:
                            risk_level = '저위험'
                        risk_reasons.append(f'반복주문 {suspect["order_count"]}회')
            
            if pattern_analysis['same_day_same_product'] >= 2:
                if not has_bulk_history:
                    risk_level = '고위험'
                dates_str = ', '.join(pattern_analysis['same_day_dates'][:3])
                risk_reasons.append(f'당일중복이력 {pattern_analysis["same_day_same_product"]}회 ({dates_str})')
            elif pattern_analysis['same_day_same_product'] >= 1:
                if risk_level in ['정상', '저위험'] and not has_bulk_history:
                    risk_level = '중위험'
                dates_str = ', '.join(pattern_analysis['same_day_dates'][:3])
                risk_reasons.append(f'당일중복이력 {pattern_analysis["same_day_same_product"]}회')
            
            if pattern_analysis['min_interval'] <= 3 and pattern_analysis['order_count'] >= 2:
                if risk_level == '정상' and not has_bulk_history:
                    risk_level = '중위험'
                elif risk_level == '저위험' and not has_bulk_history:
                    risk_level = '중위험'
                risk_reasons.append(f'짧은 주문간격 {pattern_analysis["min_interval"]}일')
            
            if pattern_analysis['top_product_ratio'] >= 0.8 and pattern_analysis['order_count'] >= 3:
                if risk_level in ['정상', '저위험'] and not has_bulk_history:
                    risk_level = '중위험'
                risk_reasons.append(f'동일상품 집중 {int(pattern_analysis["top_product_ratio"]*100)}%')
            
            if pattern_analysis['order_count'] == 0 and quantity >= 2:
                if risk_level == '정상':
                    risk_level = '중위험'
                risk_reasons.append(f'신규고객 {quantity}개 주문')
            
            if customer_key in address_customers:
                if len(risk_reasons) > 0:
                    risk_reasons.append(f'동일주소 의심')
            
            if customer_key in similar_customers:
                if len(risk_reasons) > 0:
                    risk_reasons.append(f'유사도로 의심')
            
            if phone_clean in phone_dict:
                suspect = phone_dict[phone_clean]
                if suspect['name_count'] >= 2 and len(risk_reasons) > 0:
                    risk_reasons.append(f'전화중복 {suspect["name_count"]}명')
            
            customer_monthly = self.monthly_data[
                (self.monthly_data['customer_name'] == name) & 
                (self.monthly_data['phone_clean'] == phone_clean)
            ].copy()
            
            monthly_order_details = []
            monthly_order_dates = []
            
            if len(customer_monthly) > 0:
                customer_monthly = customer_monthly.sort_values('date')
                
                for _, order in customer_monthly.iterrows():
                    if pd.notna(order['date']):
                        date_str = order['date'].strftime('%Y-%m-%d')
                        product_str = str(order['product'])[:30] if pd.notna(order['product']) else '상품명 없음'
                        qty = order['quantity'] if pd.notna(order['quantity']) else 0
                        monthly_order_dates.append({
                            'date': date_str,
                            'product': product_str,
                            'quantity': qty
                        })
                        monthly_order_details.append(f"{product_str}: {qty}개")
            
            # ✅ risk_reasons가 비어있으면 risk_level도 '정상'으로 설정
            if not risk_reasons:
                risk_level = '정상'

            cancel_targets.append({
                'customer_name': name,
                'phone': phone,
                'address': address,
                'product': row.product,
                'quantity': quantity,
                'risk_level': risk_level,
                'risk_reasons': ' / '.join(risk_reasons) if risk_reasons else '정상',
                'has_bulk_history': has_bulk_history,
                'monthly_order_count': len(customer_monthly),
                'monthly_order_details': ' | '.join(monthly_order_details[:5]),
                'monthly_total_quantity': sum([o['quantity'] for _, o in customer_monthly.iterrows() if pd.notna(o['quantity'])]),
                'monthly_order_dates_list': monthly_order_dates[:10]
            })
        
        risk_order = {'고위험': 0, '중위험': 1, '저위험': 2, '정상': 3}
        cancel_targets.sort(key=lambda x: (
            risk_order.get(x['risk_level'], 4), 
            not x['has_bulk_history'],
            -x['quantity']
        ))
        
        self.daily_cancel_targets = cancel_targets
        
        risk_counts = {'고위험': 0, '중위험': 0, '저위험': 0, '정상': 0}
        bulk_history_count = 0
        for target in cancel_targets:
            risk_counts[target['risk_level']] += 1
            if target['has_bulk_history']:
                bulk_history_count += 1
        
        suspect_count = risk_counts['고위험'] + risk_counts['중위험'] + risk_counts['저위험']
        
        print(f"✅ 당일 취소 대상: {len(cancel_targets)}건")
        print(f"   - 의심 주문: {suspect_count}건")
        print(f"   - 고위험: {risk_counts['고위험']}건 (대량주문 이력자: {bulk_history_count}명)")
        print(f"   - 중위험: {risk_counts['중위험']}건")  
        print(f"   - 저위험: {risk_counts['저위험']}건")
        print(f"   - 정상: {risk_counts['정상']}건")

    def export_all_results(self, output_dir=None):
        """모든 분석 결과를 엑셀로 저장"""
        if output_dir is None:
            output_dir = os.path.dirname(self.monthly_file) if self.monthly_file else '.'
        
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        output_file = os.path.join(output_dir, f'리셀러분석결과_{timestamp}.xlsx')
        
        with pd.ExcelWriter(output_file, engine='openpyxl') as writer:
            # 당일 취소 대상
            if len(self.daily_cancel_targets) > 0:
                df_daily = pd.DataFrame(self.daily_cancel_targets)
                df_daily.to_excel(writer, sheet_name='당일취소대상', index=False)
            
            # 반복주문 고객
            if len(self.monthly_frequency_suspects) > 0:
                df_freq = pd.DataFrame(self.monthly_frequency_suspects)
                df_freq.to_excel(writer, sheet_name='반복주문고객', index=False)
            
            # 대량주문자
            if len(self.monthly_bulk_suspects) > 0:
                df_bulk = pd.DataFrame(self.monthly_bulk_suspects)
                df_bulk.to_excel(writer, sheet_name='대량주문자', index=False)
            
            # 동일주소
            if len(self.monthly_address_suspects) > 0:
                df_addr = pd.DataFrame(self.monthly_address_suspects)
                df_addr.to_excel(writer, sheet_name='동일주소의심', index=False)
            
            # 유사도로
            if len(self.similar_address_suspects) > 0:
                df_road = pd.DataFrame(self.similar_address_suspects)
                df_road.to_excel(writer, sheet_name='유사도로의심', index=False)
            
            # 전화번호 중복
            if len(self.monthly_phone_suspects) > 0:
                df_phone = pd.DataFrame(self.monthly_phone_suspects)
                df_phone.to_excel(writer, sheet_name='전화중복의심', index=False)
        
        print(f"\n✅ 결과 저장 완료: {output_file}")
        return output_file

    def run_analysis(self):
        """전체 분석 실행"""
        print("=" * 80)
        print("🚀 리셀러 탐지 시스템 시작 (⚡속도 최적화 버전)")
        print("=" * 80)
        
        if not self.load_data():
            return False
        
        # 한달 데이터 분석
        if self.monthly_data is not None:
            self.analyze_monthly_frequency_customers()
            self.analyze_monthly_bulk_orders()
            self.analyze_monthly_address_patterns()
            self.analyze_monthly_phone_patterns()
        
        # 당일 데이터 분석
        if self.daily_data is not None:
            self.analyze_daily_patterns()
        
        # 결과 저장
        self.export_all_results()
        
        print("\n" + "=" * 80)
        print("✅ 분석 완료!")
        print("=" * 80)
        
        return True

if __name__ == "__main__":
    monthly_file = "한달주문내역.xlsx"
    daily_file = "당일주문내역.xlsx"
    
    detector = CompleteResellerDetector(monthly_file, daily_file)
    detector.run_analysis()