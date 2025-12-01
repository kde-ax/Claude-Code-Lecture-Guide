import pandas as pd
import numpy as np
import re
from datetime import datetime
from collections import defaultdict
import warnings
warnings.filterwarnings('ignore')

class BlacklistAnalyzer:
    """블랙리스트 분석기 v4 - 간단 버전
    
    블랙리스트 매칭:
    - 이름 제외한 나머지(전화번호, 주소, 이메일) 중 1개라도 일치 → 블랙리스트
    
    의심리스트 매칭:
    - 이름 제외한 나머지(전화번호, 주소, 이메일) 중 1개라도 일치 → 의심리스트
    
    당일 주문 패턴:
    - 한 사람이 6개 이상 주문 → 고위험
    - 한 사람이 같은 제품 3개 이상 주문 → 고위험
    """
    
    def __init__(self, daily_path, blacklist_path, suspicious_path):
        self.daily_path = daily_path
        self.blacklist_path = blacklist_path
        self.suspicious_path = suspicious_path
        
        self.daily_data = None
        self.blacklist_data = None
        self.suspicious_data = None
        
    def load_file(self, filepath):
        """Excel/CSV 파일 로드"""
        import os
        
        if not os.path.exists(filepath):
            print(f"❌ 파일 없음: {filepath}")
            return None
        
        file_ext = os.path.splitext(filepath)[1].lower()
        
        try:
            if file_ext == '.csv':
                for encoding in ['utf-8', 'cp949', 'euc-kr', 'utf-8-sig']:
                    try:
                        return pd.read_csv(filepath, encoding=encoding)
                    except:
                        continue
                return pd.read_csv(filepath, encoding='utf-8', errors='ignore')
            
            elif file_ext in ['.xlsx', '.xls']:
                try:
                    return pd.read_excel(filepath, engine='openpyxl')
                except:
                    try:
                        with open(filepath, 'rb') as f:
                            return pd.read_excel(f, engine='openpyxl')
                    except:
                        if file_ext == '.xls':
                            return pd.read_excel(filepath, engine='xlrd')
            
            return None
            
        except Exception as e:
            print(f"❌ 파일 로드 실패: {e}")
            return None
    
    def normalize_phone(self, phone):
        """전화번호 정규화"""
        if pd.isna(phone):
            return ''
        return re.sub(r'[^0-9]', '', str(phone))
    
    def normalize_text(self, text):
        """텍스트 정규화 (공백 제거)"""
        if pd.isna(text):
            return ''
        return str(text).strip().lower()
    
    def load_data(self):
        """모든 데이터 로드"""
        print("📊 데이터 로딩 중...")
        
        # 당일 발주서
        self.daily_data = self.load_file(self.daily_path)
        if self.daily_data is not None:
            column_mapping = {
                '주문번호': 'order_id',
                '발주일자': 'order_date',
                '수취인명': 'customer_name',
                '수취인 전화번호': 'phone',
                '수취인 주소': 'address',
                '출고상품명': 'product',
                '수량': 'quantity',
                '이메일': 'email',
                'EMAIL': 'email'
            }
            self.daily_data = self.daily_data.rename(columns=column_mapping)
            
            if 'email' not in self.daily_data.columns:
                self.daily_data['email'] = ''
            if 'order_id' not in self.daily_data.columns:
                self.daily_data['order_id'] = [f"ORD-{i+1:04d}" for i in range(len(self.daily_data))]
            
            self.daily_data['phone_clean'] = self.daily_data['phone'].apply(self.normalize_phone)
            self.daily_data['name_clean'] = self.daily_data['customer_name'].apply(self.normalize_text)
            self.daily_data['address_clean'] = self.daily_data['address'].apply(self.normalize_text)
            self.daily_data['email_clean'] = self.daily_data['email'].apply(self.normalize_text)
            
            print(f"✅ 당일 발주서: {len(self.daily_data)}건")
        
        # 블랙리스트
        self.blacklist_data = self.load_file(self.blacklist_path)
        if self.blacklist_data is not None:
            column_mapping = {
                '대표자명': 'name',
                '전화번호': 'phone',
                '주소': 'address',
                '이메일': 'email',
                'EMAIL': 'email',
                '상호명': 'company',
                '판매마켓': 'platform'
            }
            self.blacklist_data = self.blacklist_data.rename(columns=column_mapping)
            
            if 'email' not in self.blacklist_data.columns:
                self.blacklist_data['email'] = ''
            
            self.blacklist_data['phone_clean'] = self.blacklist_data['phone'].apply(self.normalize_phone)
            self.blacklist_data['name_clean'] = self.blacklist_data['name'].apply(self.normalize_text)
            self.blacklist_data['address_clean'] = self.blacklist_data['address'].apply(self.normalize_text)
            self.blacklist_data['email_clean'] = self.blacklist_data['email'].apply(self.normalize_text)
            
            print(f"✅ 블랙리스트: {len(self.blacklist_data)}건")
        
        # 의심리스트
        self.suspicious_data = self.load_file(self.suspicious_path)
        if self.suspicious_data is not None:
            column_mapping = {
                '수령인': 'name',
                '수령인 휴대전화': 'phone',
                '수령인 주소': 'address',
                '이메일': 'email',
                'EMAIL': 'email',
                '구매자 아이피': 'ip',
                '주문번호': 'order_id'
            }
            self.suspicious_data = self.suspicious_data.rename(columns=column_mapping)
            
            if 'email' not in self.suspicious_data.columns:
                self.suspicious_data['email'] = ''
            
            self.suspicious_data['phone_clean'] = self.suspicious_data['phone'].apply(self.normalize_phone)
            self.suspicious_data['name_clean'] = self.suspicious_data['name'].apply(self.normalize_text)
            self.suspicious_data['address_clean'] = self.suspicious_data['address'].apply(self.normalize_text)
            self.suspicious_data['email_clean'] = self.suspicious_data['email'].apply(self.normalize_text)
            
            print(f"✅ 의심리스트: {len(self.suspicious_data)}건")
        
        return True
    
    def check_blacklist_match(self, row):
        """블랙리스트 매칭 체크 - 이름 제외한 나머지 중 1개라도 일치"""
        if self.blacklist_data is None:
            return False, []
        
        phone = self.normalize_phone(row['phone'])
        address = self.normalize_text(row['address'])
        email = self.normalize_text(row.get('email', ''))
        
        matches = []
        
        for _, bl in self.blacklist_data.iterrows():
            bl_phone = self.normalize_phone(bl['phone'])
            bl_address = self.normalize_text(bl['address'])
            bl_email = self.normalize_text(bl.get('email', ''))
            
            # 전화번호 일치
            if phone and bl_phone and phone == bl_phone:
                matches.append(f"전화번호 일치({row['phone']})")
                return True, matches
            
            # 주소 일치
            if address and bl_address and (address in bl_address or bl_address in address):
                matches.append(f"주소 유사({row['address'][:30]}...)")
                return True, matches
            
            # 이메일 일치
            if email and bl_email and email == bl_email:
                matches.append(f"이메일 일치({email})")
                return True, matches
        
        return False, []
    
    def check_suspicious_match(self, row):
        """의심리스트 매칭 체크 - 이름 제외한 나머지 중 1개라도 일치"""
        if self.suspicious_data is None:
            return False, []
        
        phone = self.normalize_phone(row['phone'])
        address = self.normalize_text(row['address'])
        email = self.normalize_text(row.get('email', ''))
        
        matches = []
        
        for _, sus in self.suspicious_data.iterrows():
            sus_phone = self.normalize_phone(sus['phone'])
            sus_address = self.normalize_text(sus['address'])
            sus_email = self.normalize_text(sus.get('email', ''))
            
            # 전화번호 일치
            if phone and sus_phone and phone == sus_phone:
                matches.append(f"전화번호 일치({row['phone']})")
                return True, matches
            
            # 주소 일치
            if address and sus_address and (address in sus_address or sus_address in address):
                matches.append(f"주소 유사({row['address'][:30]}...)")
                return True, matches
            
            # 이메일 일치
            if email and sus_email and email == sus_email:
                matches.append(f"이메일 일치({email})")
                return True, matches
        
        return False, []
    
    def analyze_daily_patterns(self):
        """당일 주문 패턴 분석
        - 한 사람이 6개 이상 주문
        - 한 사람이 같은 제품 3개 이상 주문
        """
        print("\n🔍 당일 주문 패턴 분석 시작...")
        
        if self.daily_data is None:
            return []
        
        pattern_suspects = []
        
        # 고객별 그룹핑
        customer_groups = defaultdict(list)
        for idx, row in self.daily_data.iterrows():
            key = f"{row['name_clean']}_{row['phone_clean']}"
            customer_groups[key].append(idx)
        
        # 고위험: 한 사람이 6개 이상 주문
        for key, indices in customer_groups.items():
            total_qty = self.daily_data.loc[indices, 'quantity'].sum()
            if total_qty >= 6:
                for idx in indices:
                    pattern_suspects.append({
                        'index': idx,
                        'risk_level': 'High',
                        'reason': f'한 사람이 하루에 {int(total_qty)}개 주문'
                    })
        
        # 고위험: 같은 제품 3개 이상
        product_groups = defaultdict(lambda: defaultdict(list))
        for idx, row in self.daily_data.iterrows():
            key = f"{row['name_clean']}_{row['phone_clean']}"
            product = self.normalize_text(row['product'])
            product_groups[key][product].append(idx)
        
        for customer, products in product_groups.items():
            for product, indices in products.items():
                total_qty = self.daily_data.loc[indices, 'quantity'].sum()
                if total_qty >= 3:
                    for idx in indices:
                        pattern_suspects.append({
                            'index': idx,
                            'risk_level': 'High',
                            'reason': f'같은 제품 {int(total_qty)}개 주문'
                        })
        
        print(f"✅ 당일 주문 패턴 분석 완료: {len(pattern_suspects)}건")
        return pattern_suspects
    
    def analyze_all(self):
        """전체 분석 실행"""
        self.load_data()
        
        if self.daily_data is None:
            return {
                'results': [],
                'stats': {
                    'totalOrders': 0,
                    'blacklistCount': 0,
                    'suspiciousCount': 0,
                    'highRiskCount': 0,
                    'totalFlagged': 0
                }
            }
        
        results = []
        
        # 블랙리스트 매칭
        print("\n🔍 블랙리스트 매칭 시작...")
        blacklist_count = 0
        
        for idx, row in self.daily_data.iterrows():
            is_match, matches = self.check_blacklist_match(row)
            
            if is_match:
                blacklist_count += 1
                
                # 해당 고객의 모든 주문 찾기
                customer_orders = self.daily_data[
                    (self.daily_data['name_clean'] == row['name_clean']) &
                    (self.daily_data['phone_clean'] == row['phone_clean'])
                ]
                
                order_details = []
                for _, order in customer_orders.iterrows():
                    order_details.append({
                        'orderId': str(order.get('order_id', '')),
                        'orderDate': str(order.get('order_date', '')),
                        'product': str(order.get('product', ''))[:50],
                        'quantity': int(order.get('quantity', 0)) if pd.notna(order.get('quantity')) else 0,
                        'address': str(order.get('address', ''))
                    })
                
                results.append({
                    'orderId': str(row.get('order_id', '')),
                    'customerName': str(row['customer_name']),
                    'customerContact': str(row['phone']),
                    'orderAddress': str(row['address']),
                    'orderDate': str(row.get('order_date', '')),
                    'quantity': int(row['quantity']) if pd.notna(row['quantity']) else 0,
                    'productName': str(row['product']),
                    'riskLevel': 'Blacklist',
                    'reason': '블랙리스트 매칭: ' + ' / '.join(matches),
                    'orderDetails': order_details,
                    'totalOrderCount': int(len(customer_orders))
                })
        
        print(f"✅ 블랙리스트 매칭 완료: {blacklist_count}건")
        
        # 의심리스트 매칭
        print("\n🔍 의심리스트 매칭 시작...")
        suspicious_count = 0
        
        existing_indices = {r['orderId'] for r in results}
        
        for idx, row in self.daily_data.iterrows():
            if row.get('order_id', '') in existing_indices:
                continue
            
            is_match, matches = self.check_suspicious_match(row)
            
            if is_match:
                suspicious_count += 1
                
                # 해당 고객의 모든 주문 찾기
                customer_orders = self.daily_data[
                    (self.daily_data['name_clean'] == row['name_clean']) &
                    (self.daily_data['phone_clean'] == row['phone_clean'])
                ]
                
                order_details = []
                for _, order in customer_orders.iterrows():
                    order_details.append({
                        'orderId': str(order.get('order_id', '')),
                        'orderDate': str(order.get('order_date', '')),
                        'product': str(order.get('product', ''))[:50],
                        'quantity': int(order.get('quantity', 0)) if pd.notna(order.get('quantity')) else 0,
                        'address': str(order.get('address', ''))
                    })
                
                results.append({
                    'orderId': str(row.get('order_id', '')),
                    'customerName': str(row['customer_name']),
                    'customerContact': str(row['phone']),
                    'orderAddress': str(row['address']),
                    'orderDate': str(row.get('order_date', '')),
                    'quantity': int(row['quantity']) if pd.notna(row['quantity']) else 0,
                    'productName': str(row['product']),
                    'riskLevel': 'Suspicious',
                    'reason': '의심리스트 매칭: ' + ' / '.join(matches),
                    'orderDetails': order_details,
                    'totalOrderCount': int(len(customer_orders))
                })
        
        print(f"✅ 의심리스트 매칭 완료: {suspicious_count}건")
        
        # 당일 주문 패턴 분석
        pattern_suspects = self.analyze_daily_patterns()
        
        existing_indices = {r['orderId'] for r in results}
        high_risk_count = 0
        
        for suspect in pattern_suspects:
            idx = suspect['index']
            row = self.daily_data.loc[idx]
            
            if row.get('order_id', '') in existing_indices:
                continue
            
            high_risk_count += 1
            
            # 해당 고객의 모든 주문 찾기
            customer_orders = self.daily_data[
                (self.daily_data['name_clean'] == row['name_clean']) &
                (self.daily_data['phone_clean'] == row['phone_clean'])
            ]
            
            order_details = []
            for _, order in customer_orders.iterrows():
                order_details.append({
                    'orderId': str(order.get('order_id', '')),
                    'orderDate': str(order.get('order_date', '')),
                    'product': str(order.get('product', ''))[:50],
                    'quantity': int(order.get('quantity', 0)) if pd.notna(order.get('quantity')) else 0,
                    'address': str(order.get('address', ''))
                })
            
            results.append({
                'orderId': str(row.get('order_id', '')),
                'customerName': str(row['customer_name']),
                'customerContact': str(row['phone']),
                'orderAddress': str(row['address']),
                'orderDate': str(row.get('order_date', '')),
                'quantity': int(row['quantity']) if pd.notna(row['quantity']) else 0,
                'productName': str(row['product']),
                'riskLevel': 'High',
                'reason': suspect['reason'],
                'orderDetails': order_details,
                'totalOrderCount': int(len(customer_orders))
            })
        
        print(f"✅ 당일 패턴 고위험: {high_risk_count}건")
        
        # 통계 계산
        stats = {
            'totalOrders': int(len(self.daily_data)),
            'blacklistCount': int(blacklist_count),
            'suspiciousCount': int(suspicious_count),
            'highRiskCount': int(high_risk_count),
            'totalFlagged': int(len(results))
        }
        
        # 위험도 순 정렬
        risk_order = {'Blacklist': 0, 'Suspicious': 1, 'High': 2}
        results.sort(key=lambda x: (risk_order.get(x['riskLevel'], 3), -x['quantity']))
        
        return {
            'results': results,
            'stats': stats
        }

if __name__ == "__main__":
    analyzer = BlacklistAnalyzer(
        daily_path="당일_발주서.xlsx",
        blacklist_path="블랙리스트.xlsx",
        suspicious_path="의심리스트.xlsx"
    )
    
    result = analyzer.analyze_all()
    print("\n" + "="*60)
    print("📊 최종 분석 결과")
    print("="*60)
    print(f"총 주문 수: {result['stats']['totalOrders']}")
    print(f"블랙리스트: {result['stats']['blacklistCount']}건")
    print(f"의심리스트: {result['stats']['suspiciousCount']}건")
    print(f"고위험: {result['stats']['highRiskCount']}건")
    print(f"전체 의심 건수: {result['stats']['totalFlagged']}건")
    print("="*60)