import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import warnings
warnings.filterwarnings('ignore')

class IpAnalyzer:
    def __init__(self):
        self.df = None
        self.df_valid = None
        self.date_column = None
        
    def load_data(self, file_path):
        """데이터 로드"""
        print(f"📊 파일 로드 중: {file_path}")
        
        if file_path.endswith('.csv'):
            self.df = pd.read_csv(file_path, encoding='utf-8')
        else:
            self.df = pd.read_excel(file_path)
        
        print(f"✅ 전체 데이터: {len(self.df):,}건")
        
        # 날짜 컬럼 찾기
        possible_date_columns = ['주문일시', '주문일', '날짜', '일자', 'date', 'Date', '주문날짜', '구매일']
        
        for col in self.df.columns:
            if any(date_col in col for date_col in possible_date_columns):
                self.date_column = col
                self.df[col] = pd.to_datetime(self.df[col], errors='coerce')
                print(f"✅ 날짜 컬럼: {col}")
                break
        
        # NULL IP 제외
        self.df_valid = self.df[self.df['구매자 아이피'].notna()].copy()
        print(f"✅ 유효한 IP: {len(self.df_valid):,}건")
        
        return True
    
    def analyze(self):
        """IP 중복 분석 - 의심 + 안심고객 모두 반환"""
        print("\n🔍 IP 분석 시작...")
        
        # IP별 그룹화
        ip_groups = self.df_valid.groupby('구매자 아이피').agg({
            '네이버 포인트': 'count',
            '수령인 주소': lambda x: x.nunique(),
            '주문자 휴대전화': lambda x: x.nunique(),
            '수령인': lambda x: x.nunique()
        }).rename(columns={
            '네이버 포인트': '주문수',
            '수령인 주소': '고유주소수',
            '주문자 휴대전화': '고유전화번호수',
            '수령인': '고유수령인수'
        })
        
        # 2건 이상 주문한 IP
        duplicate_ips = ip_groups[ip_groups['주문수'] >= 2].copy()
        print(f"✅ 중복 주문 IP: {len(duplicate_ips):,}개")
        
        # 의심스러운 패턴 (기존 로직)
        suspicious = duplicate_ips[
            (duplicate_ips['고유주소수'] > 1) | 
            (duplicate_ips['고유전화번호수'] > 1) |
            (duplicate_ips['고유수령인수'] > 1)
        ].copy()
        
        print(f"✅ 의심 IP: {len(suspicious):,}개")
        
        # 의심 점수 계산
        suspicious['의심점수'] = (
            suspicious['고유주소수'] + 
            suspicious['고유전화번호수'] + 
            suspicious['고유수령인수']
        )
        
        # 위험도 분류
        def classify_risk(row):
            if row['의심점수'] >= 6:
                return 'High'
            elif row['의심점수'] > 3:
                return 'Medium'
            else:
                return 'Low'
        
        suspicious['위험도'] = suspicious.apply(classify_risk, axis=1)
        
        # ⭐ 안심고객 추가: 의심스럽지 않은 IP들
        safe_ips = ip_groups[~ip_groups.index.isin(suspicious.index)].copy()
        safe_ips['의심점수'] = 0
        safe_ips['위험도'] = 'Safe'
        
        print(f"✅ 안심고객 IP: {len(safe_ips):,}개")
        
        # 의심 + 안심고객 합치기
        all_ips = pd.concat([suspicious, safe_ips])
        
        # 상세 분석
        results = []
        
        for ip, row in all_ips.iterrows():
            ip_orders = self.df_valid[self.df_valid['구매자 아이피'] == ip]
            
            # 날짜순 정렬
            if self.date_column:
                ip_orders = ip_orders.sort_values(self.date_column)
            
            # 주문 간격 계산
            avg_interval_days = 0
            if self.date_column:
                dates = ip_orders[self.date_column].dropna()
                if len(dates) > 1:
                    intervals = [(dates.iloc[i] - dates.iloc[i-1]).days 
                                for i in range(1, len(dates))]
                    avg_interval_days = sum(intervals) / len(intervals) if intervals else 0
            
            # 수령인, 주소, 전화번호 목록
            recipients = ip_orders['수령인'].dropna().unique().tolist()
            addresses = ip_orders['수령인 주소'].dropna().unique().tolist()
            phones = ip_orders['주문자 휴대전화'].dropna().unique().tolist()
            
            # 판단 근거
            reasons = []
            if row['위험도'] == 'Safe':
                reasons.append('정상 주문 패턴')
            else:
                if row['고유주소수'] > 1:
                    reasons.append(f"다중주소({row['고유주소수']}개)")
                if row['고유전화번호수'] > 1:
                    reasons.append(f"다중전화({row['고유전화번호수']}개)")
                if row['고유수령인수'] > 1:
                    reasons.append(f"다중수령인({row['고유수령인수']}명)")
                if avg_interval_days < 7 and row['주문수'] >= 2:
                    reasons.append(f"짧은주문간격({avg_interval_days:.1f}일)")
            
            # 주문 날짜 리스트 추가
            order_details = []
            if self.date_column:
                for _, order in ip_orders.iterrows():
                    if pd.notna(order[self.date_column]) and pd.notna(order['수령인']) and pd.notna(order['수령인 주소']):
                        date_str = order[self.date_column].strftime('%Y-%m-%d %H:%M')
                        recipient = str(order['수령인'])
                        address = str(order['수령인 주소'])
                        
                        order_details.append({
                            'recipient': recipient,
                            'datetime': date_str,
                            'address': address
                        })
            
            results.append({
                'id': f"IP-{len(results)+1}",
                'ip': ip,
                'orderCount': int(row['주문수']),
                'uniqueAddresses': int(row['고유주소수']),
                'uniquePhones': int(row['고유전화번호수']),
                'uniqueRecipients': int(row['고유수령인수']),
                'suspicionScore': int(row['의심점수']),
                'riskLevel': row['위험도'],
                'avgIntervalDays': round(avg_interval_days, 1),
                'recipients': recipients[:20],
                'addresses': [addr for addr in addresses],
                'phones': phones[:20],
                'orderDetails': order_details,
                'reason': ' / '.join(reasons)
            })
        
        # 위험도순 정렬 (High > Medium > Low > Safe)
        risk_order = {'High': 0, 'Medium': 1, 'Low': 2, 'Safe': 3}
        results.sort(key=lambda x: (risk_order[x['riskLevel']], -x['suspicionScore']))
        
        # 통계
        stats = {
            'totalIps': len(self.df_valid['구매자 아이피'].unique()),
            'suspiciousIps': len(suspicious),
            'highRisk': len(suspicious[suspicious['위험도'] == 'High']),
            'mediumRisk': len(suspicious[suspicious['위험도'] == 'Medium']),
            'lowRisk': len(suspicious[suspicious['위험도'] == 'Low']),
            'safeIps': len(safe_ips)
        }
        
        print(f"\n📊 분석 완료:")
        print(f"   총 IP: {stats['totalIps']:,}개")
        print(f"   의심 IP: {stats['suspiciousIps']:,}개")
        print(f"   - 고위험: {stats['highRisk']:,}개")
        print(f"   - 중위험: {stats['mediumRisk']:,}개")
        print(f"   - 저위험: {stats['lowRisk']:,}개")
        print(f"   안심고객: {stats['safeIps']:,}개")
        
        return {
            'stats': stats,
            'results': results
        }

def analyze_ip_file(file_path: str):
    """IP 파일 분석 메인 함수"""
    analyzer = IpAnalyzer()
    
    try:
        analyzer.load_data(file_path)
        analysis = analyzer.analyze()
        return analysis
        
    except Exception as e:
        print(f"❌ 분석 실패: {str(e)}")
        raise e