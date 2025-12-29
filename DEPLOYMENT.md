# CES 2026 Volr Demo 배포 가이드

## 개요

이 문서는 ces2026.volr.io 웹사이트를 AWS에 배포하는 전체 과정을 설명합니다.

## 아키텍처

```
사용자 → Route53 (DNS) → CloudFront (CDN) → S3 (정적 파일)
                              ↑
                         ACM (SSL 인증서)
```

## 배포 순서

### 1단계: 사전 준비

필요한 정보를 수집합니다:

```bash
# ACM 인증서 ARN 확인 (반드시 us-east-1 리전)
aws acm list-certificates --region us-east-1

# Route53 호스팅 존 ID 확인
aws route53 list-hosted-zones | grep volr.io -A 2
```

출력 예시:
```json
{
  "CertificateArn": "arn:aws:acm:us-east-1:123456789012:certificate/abcd1234-...",
  "DomainName": "*.volr.io"
}

"Id": "/hostedzone/Z1234567890ABC"
```

### 2단계: Terraform 설정

1. **terraform.tfvars 파일 생성**

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
```

2. **terraform.tfvars 파일 편집**

```hcl
aws_region = "us-east-1"
domain_name = "ces2026.volr.io"
root_domain = "volr.io"

# 1단계에서 확인한 값을 입력
acm_certificate_arn = "arn:aws:acm:us-east-1:YOUR_ACCOUNT:certificate/YOUR_CERT_ID"
route53_zone_id = "YOUR_ZONE_ID"
```

### 3단계: 인프라 배포

```bash
# Terraform 초기화
terraform init

# 변경사항 확인
terraform plan

# 인프라 생성 (yes 입력)
terraform apply

# 출력값 확인 및 저장
terraform output
```

중요한 출력값:
- `s3_bucket_name`: ces2026.volr.io
- `cloudfront_distribution_id`: E1234567890ABC
- `website_url`: https://ces2026.volr.io

### 4단계: GitHub Secrets 설정

GitHub 저장소에서 Settings → Secrets and variables → Actions → New repository secret

다음 5개의 Secret을 추가:

| Name | Value | 예시 |
|------|-------|------|
| `AWS_ACCESS_KEY_ID` | AWS 액세스 키 | `AKIAIOSFODNN7EXAMPLE` |
| `AWS_SECRET_ACCESS_KEY` | AWS 시크릿 키 | `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY` |
| `AWS_REGION` | AWS 리전 | `us-east-1` |
| `S3_BUCKET` | S3 버킷 이름 (3단계 출력) | `ces2026.volr.io` |
| `CLOUDFRONT_DISTRIBUTION_ID` | CloudFront ID (3단계 출력) | `E1234567890ABC` |

### 5단계: 자동 배포 테스트

```bash
# main 브랜치에 커밋 후 푸시
git add .
git commit -m "Setup deployment infrastructure"
git push origin main
```

GitHub Actions 탭에서 배포 진행상황 확인:
- ✅ Checkout code
- ✅ Setup Node.js
- ✅ Install dependencies
- ✅ Build application
- ✅ Configure AWS credentials
- ✅ Sync files to S3
- ✅ Invalidate CloudFront cache
- ✅ Deployment complete

### 6단계: 배포 확인

1. **웹사이트 접속**
   ```
   https://ces2026.volr.io
   ```

2. **DNS 확인**
   ```bash
   dig ces2026.volr.io
   nslookup ces2026.volr.io
   ```

3. **SSL 인증서 확인**
   - 브라우저 주소창의 자물쇠 아이콘 클릭
   - 인증서 정보 확인

## 일상적인 배포 프로세스

코드 변경 후 배포는 자동으로 이루어집니다:

```bash
# 1. 코드 수정
vim src/App.tsx

# 2. 로컬 테스트
npm run dev

# 3. 커밋 및 푸시 (자동 배포 트리거)
git add .
git commit -m "Update feature X"
git push origin main

# 4. GitHub Actions에서 자동으로:
#    - 빌드
#    - S3 업로드
#    - CloudFront 캐시 무효화
#    - 약 2-3분 후 배포 완료
```

## 수동 배포 (비상시)

GitHub Actions가 작동하지 않을 경우:

```bash
# 빌드
npm run build

# S3 업로드
aws s3 sync dist/ s3://ces2026.volr.io \
  --delete \
  --cache-control "public, max-age=31536000, immutable" \
  --exclude "*.html"

aws s3 sync dist/ s3://ces2026.volr.io \
  --cache-control "public, max-age=0, must-revalidate" \
  --exclude "*" \
  --include "*.html"

# 캐시 무효화
aws cloudfront create-invalidation \
  --distribution-id E1234567890ABC \
  --paths "/*"
```

## 문제 해결

### 문제 1: 이전 버전이 계속 보임

**원인**: CloudFront 캐시

**해결**:
```bash
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

### 문제 2: SSL 인증서 오류

**확인사항**:
- ACM 인증서가 us-east-1 리전에 있는지
- 인증서가 ces2026.volr.io 또는 *.volr.io를 커버하는지
- 인증서 상태가 "발급됨"인지

### 문제 3: DNS 해석 안됨

**확인**:
```bash
# Route53 레코드 확인
aws route53 list-resource-record-sets \
  --hosted-zone-id YOUR_ZONE_ID \
  | grep ces2026 -A 5

# DNS 전파 확인 (최대 48시간 소요 가능)
dig ces2026.volr.io @8.8.8.8
```

### 문제 4: GitHub Actions 실패

**확인사항**:
1. Secrets가 모두 올바르게 설정되었는지
2. AWS 자격증명이 유효한지
3. S3 버킷 이름이 정확한지
4. CloudFront Distribution ID가 정확한지

**Actions 로그 확인**:
- GitHub → Actions 탭
- 실패한 워크플로우 클릭
- 각 단계별 로그 확인

## 인프라 관리

### 인프라 업데이트

```bash
cd terraform

# .tf 파일 수정 후
terraform plan
terraform apply
```

### 인프라 삭제

⚠️ **주의**: 모든 데이터가 삭제됩니다!

```bash
cd terraform
terraform destroy
```

### 비용 모니터링

AWS 콘솔에서 확인:
- CloudFront: 데이터 전송량
- S3: 스토리지 및 요청 수
- Route53: 호스팅 존 및 쿼리 수

일반적인 월 예상 비용:
- S3: $0.50 - $2
- CloudFront: $1 - $10 (트래픽에 따라)
- Route53: $0.50
- **총합**: 약 $2 - $15/월

## 백업 및 롤백

### 백업

S3 버전 관리가 활성화되어 있어 자동 백업됩니다:

```bash
# 이전 버전 확인
aws s3api list-object-versions \
  --bucket ces2026.volr.io \
  --prefix index.html
```

### 롤백

```bash
# 이전 Git 커밋으로 롤백
git revert HEAD
git push origin main

# 또는 특정 버전으로
git checkout <commit-hash>
git push origin main -f
```

## 도움말

추가 도움이 필요하면:
1. Terraform 문서: https://registry.terraform.io/providers/hashicorp/aws
2. AWS 문서: https://docs.aws.amazon.com/
3. GitHub Actions 문서: https://docs.github.com/actions
