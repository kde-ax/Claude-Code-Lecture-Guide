from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import os
import io
import time
from datetime import datetime
from analyzer import CompleteResellerDetector
import pandas as pd
from ip_analyzer import analyze_ip_file
import shutil
from blacklist_analyzer import BlacklistAnalyzer

app = FastAPI(title="Reseller Detection API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173","http://frontend:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Reseller Detection API v2.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}


@app.post("/api/analyze")
async def analyze_files(
    monthly_file: UploadFile = File(..., description="한달 주문내역"),
    daily_file: UploadFile = File(..., description="당일 주문내역")
):
    monthly_path = None
    daily_path = None
    
    try:
        print(f"\n{'='*60}")
        print(f"📁 월간 파일: {monthly_file.filename}")
        print(f"📁 당일 파일: {daily_file.filename}")
        print(f"{'='*60}\n")
        
        monthly_content = await monthly_file.read()
        daily_content = await daily_file.read()
        
        print(f"✅ 파일 읽기 완료:")
        print(f"   - 월간: {len(monthly_content):,} bytes")
        print(f"   - 당일: {len(daily_content):,} bytes\n")
        
        # 원본 확장자 유지
        timestamp = int(time.time())
        monthly_ext = os.path.splitext(monthly_file.filename)[1]
        daily_ext = os.path.splitext(daily_file.filename)[1]
        
        monthly_path = f"temp_monthly_{timestamp}{monthly_ext}"
        daily_path = f"temp_daily_{timestamp}{daily_ext}"
        
        with open(monthly_path, 'wb') as f:
            f.write(monthly_content)
        
        with open(daily_path, 'wb') as f:
            f.write(daily_content)
        
        print(f"✅ 임시 파일 저장:")
        print(f"   - 월간: {monthly_path}")
        print(f"   - 당일: {daily_path}\n")
        
        try:
            print("🔄 분석기 초기화...")
            detector = CompleteResellerDetector(monthly_path, daily_path)
            
            print("📊 데이터 로딩...")
            if not detector.load_data():
                raise HTTPException(status_code=400, detail="파일 로드 실패")
            
            monthly_count = len(detector.monthly_data) if detector.monthly_data is not None else 0
            daily_count = len(detector.daily_data) if detector.daily_data is not None else 0
            
            print(f"\n✅ 데이터 로드 완료:")
            print(f"   - 월간: {monthly_count:,}건")
            print(f"   - 당일: {daily_count:,}건")
            
            if detector.monthly_data is not None:
                print(f"   - 월간 컬럼: {list(detector.monthly_data.columns)}")
            if detector.daily_data is not None:
                print(f"   - 당일 컬럼: {list(detector.daily_data.columns)}")
            print()
            
            print("🔍 분석 시작...\n")
            detector.analyze_monthly_frequency_customers()
            detector.analyze_monthly_bulk_orders()
            detector.analyze_monthly_address_patterns()
            detector.analyze_monthly_phone_patterns()
            detector.analyze_daily_patterns()
            
            print(f"\n{'='*60}")
            print(f"📊 분석 결과:")
            print(f"   - 반복 주문: {len(detector.monthly_frequency_suspects)}명")
            print(f"   - 대량 주문: {len(detector.monthly_bulk_suspects)}명")
            print(f"   - 주소 의심: {len(detector.monthly_address_suspects)}개")
            print(f"   - 유사 도로: {len(detector.similar_address_suspects)}개")
            print(f"   - 전화 의심: {len(detector.monthly_phone_suspects)}개")
            print(f"   - 당일 취소 대상: {len(detector.daily_cancel_targets)}건")
            print(f"{'='*60}\n")
            
            results = []
            
            for idx, target in enumerate(detector.daily_cancel_targets):
                risk_level_map = {
                    '고위험': 'High',
                    '중위험': 'Medium',
                    '저위험': 'Low',
                    '정상': 'Safe'
                }
                
                results.append({
                    'id': f"{target['customer_name']}_{target['phone']}_{idx}",
                    'customerName': target['customer_name'],
                    'customerContact': target['phone'],
                    'orderAddress': target.get('address', ''),
                    'orderId': f"ORD-{idx+1:04d}",
                    'orderDate': datetime.now().strftime('%Y-%m-%d'),
                    'riskLevel': risk_level_map.get(target['risk_level'], 'Low'),
                    'reason': target['risk_reasons']
                })
            
            print(f"✅ 분석 완료: {len(results)}건 반환\n")
            
            return {
                "results": results,
                "summary": {
                    "total": len(detector.daily_cancel_targets),
                    "high_risk": len([t for t in detector.daily_cancel_targets if t['risk_level'] == '고위험']),
                    "medium_risk": len([t for t in detector.daily_cancel_targets if t['risk_level'] == '중위험']),
                    "low_risk": len([t for t in detector.daily_cancel_targets if t['risk_level'] == '저위험']),
                    "safe": len([t for t in detector.daily_cancel_targets if t['risk_level'] == '정상']),
                    "bulk_history": len([t for t in detector.daily_cancel_targets if t.get('has_bulk_history', False)])
                }
            }
            
        finally:
            try:
                if monthly_path and os.path.exists(monthly_path):
                    os.remove(monthly_path)
                    print("🗑️ 월간 임시 파일 삭제")
                if daily_path and os.path.exists(daily_path):
                    os.remove(daily_path)
                    print("🗑️ 당일 임시 파일 삭제")
            except Exception as e:
                print(f"⚠️ 파일 삭제 실패: {e}")
        
    except Exception as e:
        print(f"\n❌ 에러 발생: {str(e)}\n")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/export-csv")
async def export_csv(
    monthly_file: UploadFile = File(...),
    daily_file: UploadFile = File(...)
):
    monthly_path = None
    daily_path = None
    
    try:
        print(f"\n📥 CSV 생성 요청\n")
        
        monthly_content = await monthly_file.read()
        daily_content = await daily_file.read()
        
        timestamp = int(time.time())
        monthly_ext = os.path.splitext(monthly_file.filename)[1]
        daily_ext = os.path.splitext(daily_file.filename)[1]
        
        monthly_path = f"temp_monthly_csv_{timestamp}{monthly_ext}"
        daily_path = f"temp_daily_csv_{timestamp}{daily_ext}"
        
        with open(monthly_path, 'wb') as f:
            f.write(monthly_content)
        
        with open(daily_path, 'wb') as f:
            f.write(daily_content)
        
        try:
            detector = CompleteResellerDetector(monthly_path, daily_path)
            
            if not detector.load_data():
                raise HTTPException(status_code=400, detail="파일 로드 실패")
            
            detector.analyze_monthly_frequency_customers()
            detector.analyze_monthly_bulk_orders()
            detector.analyze_monthly_address_patterns()
            detector.analyze_monthly_phone_patterns()
            detector.analyze_daily_patterns()
            
            csv_data = []
            for target in detector.daily_cancel_targets:
                csv_data.append({
                    '고객명': target['customer_name'],
                    '전화번호': target['phone'],
                    '주소': target.get('address', ''),
                    '당일주문상품': str(target.get('product', ''))[:50],
                    '당일주문수량': target.get('quantity', 0),
                    '위험도': target['risk_level'],
                    '사유': target['risk_reasons'],
                    '대량주문이력': '예' if target.get('has_bulk_history', False) else '아니오',
                    '한달주문횟수': target.get('monthly_order_count', 0),
                    '한달총수량': target.get('monthly_total_quantity', 0),
                    '한달주문상세': target.get('monthly_order_details', '')
                })
            
            df = pd.DataFrame(csv_data)
            
            csv_buffer = io.StringIO()
            df.to_csv(csv_buffer, index=False, encoding='utf-8-sig')
            csv_buffer.seek(0)
            
            timestamp_str = datetime.now().strftime('%Y%m%d_%H%M%S')
            filename = f'reseller_analysis_{timestamp_str}.csv'
            
            print(f"✅ CSV 생성 완료: {len(csv_data)}건\n")
            
            return StreamingResponse(
                io.BytesIO(csv_buffer.getvalue().encode('utf-8-sig')),
                media_type='text/csv',
                headers={
                    'Content-Disposition': f'attachment; filename="{filename}"'
                }
            )
            
        finally:
            try:
                if monthly_path and os.path.exists(monthly_path):
                    os.remove(monthly_path)
                if daily_path and os.path.exists(daily_path):
                    os.remove(daily_path)
            except:
                pass
        
    except Exception as e:
        print(f"❌ CSV 생성 실패: {str(e)}\n")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
    
@app.post("/api/analyze-ip")
async def analyze_ip_endpoint(ip_file: UploadFile = File(...)):
    try:
        print("\n============================================================")
        print(f"📁 IP 파일: {ip_file.filename}")
        print("============================================================")
        
        temp_ip_path = f"temp_ip_{int(time.time() * 1000)}{os.path.splitext(ip_file.filename)[1]}"
        
        with open(temp_ip_path, "wb") as buffer:
            shutil.copyfileobj(ip_file.file, buffer)
        
        file_size = os.path.getsize(temp_ip_path)
        print(f"✅ 파일 저장: {file_size:,} bytes")
        
        print("🔍 IP 분석 시작...")
        analysis_result = analyze_ip_file(temp_ip_path)
        
        try:
            os.remove(temp_ip_path)
            print(f"🗑️ 임시 파일 삭제")
        except Exception as e:
            print(f"⚠️ 임시 파일 삭제 실패: {e}")
        
        print("✅ 분석 완료")
        print("============================================================")
        
        return analysis_result
        
    except Exception as e:
        print(f"❌ IP 분석 오류: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


# 블랙리스트 분석 엔드포인트 (3단계 위험도)
@app.post("/api/analyze-blacklist")
async def analyze_blacklist(
    daily_file: UploadFile = File(..., description="당일 발주서"),
    blacklist_file: UploadFile = File(..., description="블랙리스트"),
    suspicious_file: UploadFile = File(..., description="의심리스트")
):
    """블랙리스트 분석 엔드포인트 - 3단계 위험도
    
    위험도:
    - Blacklist: 블랙리스트 파일과 매칭 (이름 제외)
    - Suspicious: 의심리스트 파일과 매칭 (이름 제외)
    - High: 6개 이상 주문 OR 같은 제품 3개 이상
    """
    daily_path = None
    blacklist_path = None
    suspicious_path = None
    
    try:
        print(f"\n{'='*60}")
        print(f"📁 당일 발주서: {daily_file.filename}")
        print(f"📁 블랙리스트: {blacklist_file.filename}")
        print(f"📁 의심리스트: {suspicious_file.filename}")
        print(f"{'='*60}\n")
        
        # 파일 읽기
        daily_content = await daily_file.read()
        blacklist_content = await blacklist_file.read()
        suspicious_content = await suspicious_file.read()
        
        print(f"✅ 파일 읽기 완료:")
        print(f"   - 당일: {len(daily_content):,} bytes")
        print(f"   - 블랙리스트: {len(blacklist_content):,} bytes")
        print(f"   - 의심리스트: {len(suspicious_content):,} bytes\n")
        
        # 임시 파일 저장 (원본 확장자 유지)
        timestamp = int(time.time())
        daily_ext = os.path.splitext(daily_file.filename)[1]
        blacklist_ext = os.path.splitext(blacklist_file.filename)[1]
        suspicious_ext = os.path.splitext(suspicious_file.filename)[1]
        
        daily_path = f"temp_daily_{timestamp}{daily_ext}"
        blacklist_path = f"temp_blacklist_{timestamp}{blacklist_ext}"
        suspicious_path = f"temp_suspicious_{timestamp}{suspicious_ext}"
        
        with open(daily_path, 'wb') as f:
            f.write(daily_content)
        
        with open(blacklist_path, 'wb') as f:
            f.write(blacklist_content)
        
        with open(suspicious_path, 'wb') as f:
            f.write(suspicious_content)
        
        print(f"✅ 임시 파일 저장:")
        print(f"   - 당일: {daily_path}")
        print(f"   - 블랙리스트: {blacklist_path}")
        print(f"   - 의심리스트: {suspicious_path}\n")
        
        try:
            print("🔄 블랙리스트 분석기 초기화...")
            analyzer = BlacklistAnalyzer(daily_path, blacklist_path, suspicious_path)
            
            print("📊 분석 시작...\n")
            result = analyzer.analyze_all()
            
            print(f"\n{'='*60}")
            print(f"📊 분석 결과:")
            print(f"   - 총 주문 수: {result['stats']['totalOrders']}")
            print(f"   - 블랙리스트 매칭: {result['stats']['blacklistCount']}건")
            print(f"   - 의심리스트 매칭: {result['stats']['suspiciousCount']}건")
            print(f"   - 고위험: {result['stats']['highRiskCount']}건")
            print(f"   - 전체 의심 건수: {result['stats']['totalFlagged']}건")
            print(f"{'='*60}\n")
            
            print(f"✅ 분석 완료: {len(result['results'])}건 반환\n")
            
            return {
                "results": result["results"],
                "stats": result["stats"]
            }
            
        finally:
            try:
                if daily_path and os.path.exists(daily_path):
                    os.remove(daily_path)
                    print("🗑️ 당일 임시 파일 삭제")
                if blacklist_path and os.path.exists(blacklist_path):
                    os.remove(blacklist_path)
                    print("🗑️ 블랙리스트 임시 파일 삭제")
                if suspicious_path and os.path.exists(suspicious_path):
                    os.remove(suspicious_path)
                    print("🗑️ 의심리스트 임시 파일 삭제")
            except Exception as e:
                print(f"⚠️ 파일 삭제 실패: {e}")
        
    except Exception as e:
        print(f"\n❌ 에러 발생: {str(e)}\n")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))