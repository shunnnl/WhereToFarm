import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// 컴포넌트 import
import Navbar from './components/common/Navbar';
import Home from './pages/home/Home';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        {/* 네비게이션 바는 동일한 너비와 패딩 사용 */}
        <Navbar />
        
        {/* 페이지 내용 */}
        <Routes>
          {/* 기본 페이지 */}
          <Route path="/" element={<Home />} />
          {/* 추가 라우트들... */}
        </Routes>
        
        {/* 푸터가 있다면 여기에 추가 */}
      </div>
    </BrowserRouter>
  );
}

export default App;