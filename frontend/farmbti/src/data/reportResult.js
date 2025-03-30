export const farmerTypes = [
    {
      id: 1,
      title: "드림빌더형",
      subtitle: "농업도 비즈니스다!",
      description: "자금 여유가 많고 도시 접근성을 중시하는 타입입니다. 활발한 공동체 활동과 깨끗한 자연환경을 모두 고려하여, 대규모 농업과 비즈니스 모델을 동시에 꿈꾸는 야망가입니다. 농업을 단순한 생계 수단이 아닌 하나의 비즈니스로 접근하여 수익 창출과 지속 가능한 성장을 목표로 합니다.",
      conditions: {
        fund: "high",
        access: "high",
        relation: "high",
        nature: "high"
      }
    },
    {
      id: 2,
      title: "협업러형",
      subtitle: "사람과 연결된 귀농",
      description: "돈은 많지만 자연환경보다 접근성과 공동체를 중시합니다. 도시 근교에 위치하여 네트워킹과 협업 농업을 선호하며, 사람들과 함께하는 활동을 통해 농업 생태계를 구축하려 합니다. 지역 사회와의 긴밀한 협력을 통해 새로운 기회를 모색하는 유형입니다.",
      conditions: {
        fund: "high",
        access: "high",
        relation: "high",
        nature: "low"
      }
    },
    {
      id: 3,
      title: "힐링러형",
      subtitle: "자연이 나의 치료제",
      description: "경제적 여유가 있지만 조용한 자연 속에서 생활하며 건강한 라이프스타일을 추구합니다. 친환경 농업과 자연과의 조화를 중요하게 여기며, 자연 속에서 힐링을 추구하는 삶을 선호합니다. 소박하고 평화로운 일상을 중요하게 생각하는 유형입니다.",
      conditions: {
        fund: "high",
        access: "high",
        relation: "low",
        nature: "high"
      }
    },
    {
      id: 4,
      title: "도시형 농업가",
      subtitle: "편리함을 놓칠 수 없다",
      description: "농업을 실천하면서도 도시 인프라와 편리함을 중시합니다. 자연환경보다 접근성과 생활 편의성을 우선시하며, 도심 가까운 농업지대에서 효율적인 농업을 추구합니다. 경제적 이익과 실용성을 고려하여 안정적인 생활 기반을 확보하려 합니다.",
      conditions: {
        fund: "high",
        access: "high",
        relation: "low",
        nature: "low"
      }
    },
    {
      id: 5,
      title: "로컬 인싸형",
      subtitle: "마을 행사 무조건 참여",
      description: "자금력이 있고 공동체 활동에도 적극적으로 참여하는 타입입니다. 자연환경도 중요하게 생각하며, 로컬 리더로서 커뮤니티를 주도하며 다양한 행사를 기획하고 참여합니다. 지역 사회와 어우러지며 활기찬 분위기를 만들어가는 데 열정을 가지고 있습니다.",
      conditions: {
        fund: "high",
        access: "low",
        relation: "high",
        nature: "high"
      }
    },
    {
      id: 6,
      title: "공동체 메이트형",
      subtitle: "같이 사는 시골살이",
      description: "공동체 중심으로 살아가고 싶지만 환경보다는 실용성을 중시합니다. 도시 접근성이 낮아도 공동체와 함께하는 삶을 중요하게 여기며, 사람들과의 교류와 협력을 통해 따뜻한 분위기를 만들어 갑니다. 농업보다는 이웃과의 관계를 우선시하는 유형입니다.",
      conditions: {
        fund: "high",
        access: "low",
        relation: "high",
        nature: "low"
      }
    },
    {
      id: 7,
      title: "프리미엄 농장주형",
      subtitle: "내 농장은 감성 맛집",
      description: "깨끗한 자연 속에서 프리미엄 농업을 운영하며 감성 마케팅에 관심이 많습니다. 자금 여유를 바탕으로 고품질 농산물을 생산하여 소비자들에게 특별한 경험을 제공하고자 합니다. 자연환경과 품질을 중시하여 브랜드 가치를 높이는 전략을 추구합니다.",
      conditions: {
        fund: "high",
        access: "low",
        relation: "low",
        nature: "high"
      }
    },
    {
      id: 8,
      title: "조용한 부자형",
      subtitle: "소음 없는 귀농 라이프",
      description: "조용하고 평화로운 농촌 생활을 선호하며, 프라이버시를 중시하는 타입입니다. 공동체 활동에 부담을 느끼며, 독립적이고 차분한 공간을 추구합니다. 넓은 농지에서 혼자만의 시간을 보내며 여유로운 삶을 지향합니다.",
      conditions: {
        fund: "high",
        access: "low",
        relation: "low",
        nature: "low"
      }
    },
    {
      id: 9,
      title: "도전형",
      subtitle: "농업에 도전장을 내밀다!",
      description: "돈은 부족하지만 귀농 창업에 열정을 가지고 있습니다. 네트워킹과 교통 접근성을 중요시하며, 새로운 농업 아이디어를 적극적으로 실험하고 발전시키려 합니다. 농업을 통해 새로운 가능성을 탐구하며 끊임없이 도전하는 유형입니다.",
      conditions: {
        fund: "low",
        access: "high",
        relation: "high",
        nature: "high"
      }
    },
    {
      id: 10,
      title: "라이프 스타일러형",
      subtitle: "농업도, 생활도 둘 다 놓칠 수 없다",
      description: "도시 접근성을 중요하게 생각하며 생활과 농업을 병행하는 타입입니다. 직장과 농업을 병행하며 현실적이고 실용적인 선택을 중시합니다. 일상생활과 농업 사이의 균형을 유지하며, 유연한 귀농 방식을 추구합니다.",
      conditions: {
        fund: "low",
        access: "high",
        relation: "high",
        nature: "low"
      }
    },
    {
      id: 11,
      title: "미니멀 자연인형",
      subtitle: "느리고 단순하게",
      description: "자연 속에서 단순하고 소박한 삶을 지향하며, 친환경 자급자족형 생활을 선호합니다. 자연과 더불어 사는 것을 중요시하며, 빠르게 변화하는 세상 속에서 느리지만 여유로운 일상을 꿈꿉니다. 자급자족과 자립을 통해 자율적인 삶을 살고자 합니다.",
      conditions: {
        fund: "low",
        access: "high",
        relation: "low",
        nature: "high"
      }
    },
    {
      id: 12,
      title: "소확행",
      subtitle: "작지만 확실한 행복을 찾다",
      description: "생계를 위한 농업이 아니라 취미로 가벼운 농사를 지향합니다. 교외 접근성이 중요하지만 공동체 활동에는 부담을 느끼며, 주말마다 소소한 텃밭 가꾸기를 통해 행복을 찾습니다. 작고 확실한 행복을 추구하는 유형입니다.",
      conditions: {
        fund: "low",
        access: "high",
        relation: "low",
        nature: "low"
      }
    },
    {
      id: 13,
      title: "공동체생태형",
      subtitle: "함께 가꾸는 마을",
      description: "돈은 부족하지만 공동체가 활성화된 곳에서 자연 친화적 생태 농업을 운영하고자 합니다. 자연환경도 중요하게 생각하며, 협력과 상생을 통해 지속 가능한 농업을 실현합니다. 공동체 중심의 생활을 통해 자연과 사람 모두를 소중히 여깁니다.",
      conditions: {
        fund: "low",
        access: "low",
        relation: "high",
        nature: "high"
      }
    },
    {
      id: 14,
      title: "사교왕",
      subtitle: "함께하면 뭐든 가능하다!",
      description: "사람들과 어울리며 사는 것을 중요하게 생각하는 타입입니다. 농업보다는 인간관계와 공동체 생활을 중시하며, 다양한 소모임과 지역 행사에 적극 참여합니다. 밝고 활기찬 성격으로 사람들과 소통하며 지역 분위기를 주도합니다.",
      conditions: {
        fund: "low",
        access: "low",
        relation: "high",
        nature: "low"
      }
    },
    {
      id: 15,
      title: "자연인형",
      subtitle: "자연과 하나 되다",
      description: "자연 속에서 조용히 살아가는 것을 지향합니다. 혼자만의 시간을 즐기며 자연과 동화되는 삶을 추구하며, 외부와의 교류보다는 자연과 함께하는 시간을 소중히 여깁니다. 자연의 소리에 귀 기울이며 고요한 삶을 살아갑니다.",
      conditions: {
        fund: "low",
        access: "low",
        relation: "low",
        nature: "high"
      }
    },
    {
      id: 16,
      title: "은둔형",
      subtitle: "숲 속에서 조용히 살래요",
      description: "외부와의 교류를 최소화하며 조용하고 은둔적인 삶을 지향합니다. 농업을 통해 최소한의 경제적 자립을 이루고, 세상과 거리를 둔 독립적인 생활을 선호합니다. 자연 속에서 홀로 여유를 즐기며 자유롭게 살아가는 타입입니다.",
      conditions: {
        fund: "low",
        access: "low",
        relation: "low",
        nature: "low"
      }
    }
  ];
  
  // FARM 점수에 따른 유형 찾기 함수
  export const findFarmerType = (scores) => {
    // 각 점수를 high/low로 변환
    const conditions = {
      fund: scores.F >= 0.6 ? "high" : "low",
      access: scores.A >= 0.6 ? "high" : "low",
      relation: scores.R >= 0.6 ? "high" : "low",
      nature: scores.M >= 0.6 ? "high" : "low"
    };
  
    // 조건에 맞는 유형 찾기
    return farmerTypes.find(type => 
      type.conditions.fund === conditions.fund &&
      type.conditions.access === conditions.access &&
      type.conditions.relation === conditions.relation &&
      type.conditions.nature === conditions.nature
    );
  };