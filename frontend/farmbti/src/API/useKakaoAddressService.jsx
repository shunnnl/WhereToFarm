import { useEffect, useCallback } from 'react';

const useKakaoAddressService = (onAddressSelected) => {
  // 카카오 주소검색 API 스크립트 로드
  useEffect(() => {
    const script = document.createElement('script');
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.async = true;
    document.head.appendChild(script);
    
    return () => {
      // 안전하게 스크립트 제거 시도
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  // 주소검색 팝업 열기 함수
  const openAddressSearch = useCallback(() => {
    // window.daum이 로드되었는지 확인
    if (!window.daum || !window.daum.Postcode) {
      alert('주소검색 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    new window.daum.Postcode({
      oncomplete: function(data) {
        // 선택한 주소 데이터 처리
        let fullAddress = '';
        let extraAddress = '';

        // 사용자가 선택한 주소 타입에 따라 해당 주소 값 사용
        if (data.userSelectedType === 'R') { // 도로명 주소
          fullAddress = data.roadAddress;
        } else { // 지번 주소
          fullAddress = data.jibunAddress;
        }

        // 법정동명이 있을 경우 추가
        if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
          extraAddress += data.bname;
        }
        
        // 건물명이 있고, 공동주택일 경우 추가
        if (data.buildingName !== '' && data.apartment === 'Y') {
          extraAddress += (extraAddress !== '' ? ', ' + data.buildingName : data.buildingName);
        }
        
        // 상세주소와 참고항목 합치기
        if (extraAddress !== '') {
          fullAddress += ' (' + extraAddress + ')';
        }

        // 콜백으로 주소 전달
        onAddressSelected({
          address: fullAddress,
          zonecode: data.zonecode
        });
      }
    }).open();
  }, [onAddressSelected]);

  return { openAddressSearch };
};

export default useKakaoAddressService;

