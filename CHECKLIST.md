# CES 2026 배포 체크리스트

이 체크리스트를 따라 단계별로 배포를 진행하세요.

## ✅ 사전 준비 (한 번만 수행)

### AWS 정보 수집

- [ ] ACM 인증서 ARN 확인
  ```bash
  aws acm list-certificates --region us-east-1
  ```
  결과: `arn:aws:acm:us-east-1:____________:certificate/____________`

- [ ] Route53 호스팅 존 ID 확인
  ```bash
  aws route53 list-hosted-zones | grep volr.io -A 2
  ```
  결과: `Z____________`

### Terraform 설정

- [ ] terraform.tfvars 파일 생성
  ```bash
  cd terraform
  cp terraform.tfvars.example terraform.tfvars
  ```

- [ ] terraform.tfvars에 실제 값 입력
  - `acm_certificate_arn`: ACM 인증서 ARN
  - `route53_zone_id`: Route53 호스팅 존 ID

### 인프라 배포

- [ ] Terraform 초기화
  ```bash
  terraform init
  ```

- [ ] 변경사항 확인
  ```bash
  terraform plan
  ```

- [ ] 인프라 생성
  ```bash
  terraform apply
  ```

- [ ] 출력값 저장
  ```bash
  terraform output > ../terraform-outputs.txt
  ```
  필요한 값:
  - `s3_bucket_name`
  - `cloudfront_distribution_id`

### GitHub 설정

- [ ] GitHub Secrets 추가 (Settings → Secrets and variables → Actions)
  - [ ] `AWS_ACCESS_KEY_ID`
  - [ ] `AWS_SECRET_ACCESS_KEY`
  - [ ] `AWS_REGION` = `us-east-1`
  - [ ] `S3_BUCKET` = (terraform output에서 확인)
  - [ ] `CLOUDFRONT_DISTRIBUTION_ID` = (terraform output에서 확인)

## 🚀 첫 배포

- [ ] 모든 변경사항 커밋
  ```bash
  git add .
  git commit -m "Add deployment infrastructure"
  ```

- [ ] main 브랜치에 푸시
  ```bash
  git push origin main
  ```

- [ ] GitHub Actions 확인
  - [ ] https://github.com/YOUR_USERNAME/YOUR_REPO/actions 방문
  - [ ] 배포 워크플로우 실행 확인
  - [ ] 모든 단계가 성공했는지 확인

## 🔍 배포 확인

- [ ] 웹사이트 접속
  - [ ] https://ces2026.volr.io 접속
  - [ ] 페이지가 정상적으로 로드되는지 확인

- [ ] DNS 확인
  ```bash
  dig ces2026.volr.io
  nslookup ces2026.volr.io
  ```

- [ ] SSL 인증서 확인
  - [ ] 브라우저 주소창의 자물쇠 아이콘 확인
  - [ ] 인증서 정보 확인

- [ ] 기능 테스트
  - [ ] Volr 로그인 테스트
  - [ ] 결제 기능 테스트
  - [ ] 결제 히스토리 확인

## 📝 일상적인 배포 (코드 변경 후)

- [ ] 로컬에서 개발 및 테스트
  ```bash
  npm run dev
  ```

- [ ] 변경사항 커밋
  ```bash
  git add .
  git commit -m "설명"
  ```

- [ ] main 브랜치에 푸시 (자동 배포)
  ```bash
  git push origin main
  ```

- [ ] GitHub Actions에서 배포 상태 확인

- [ ] 2-3분 후 웹사이트에서 변경사항 확인

## 🛠️ 문제 해결

### 이전 버전이 보이는 경우

- [ ] CloudFront 캐시 무효화
  ```bash
  aws cloudfront create-invalidation \
    --distribution-id YOUR_DIST_ID \
    --paths "/*"
  ```

### GitHub Actions 실패

- [ ] Secrets 값 재확인
- [ ] AWS 자격증명 유효성 확인
- [ ] Actions 로그 확인

### DNS 문제

- [ ] DNS 전파 대기 (최대 48시간)
- [ ] Route53 레코드 확인
  ```bash
  aws route53 list-resource-record-sets \
    --hosted-zone-id YOUR_ZONE_ID
  ```

## 📚 추가 자료

- 상세 가이드: `DEPLOYMENT.md`
- Terraform 문서: `terraform/README.md`
- 프로젝트 개요: `README.md`

---

**완료 날짜**: ___________
**배포자**: ___________
**최종 URL**: https://ces2026.volr.io

