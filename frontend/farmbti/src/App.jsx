import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// 레이아웃 컴포넌트 import
import NavBar from './components/common/NavBar';
import PageLayout from './components/layout/PageLayout';

// 페이지 컴포넌트 import
import Home from './pages/home/Home';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        {/* Navigation Bar */}
        <NavBar />
        
        {/* Main Content with Layout */}
        <PageLayout>
          <Routes>
            {/* 기본 페이지 */}
            <Route path="/" element={<Home />} />
          </Routes>
        </PageLayout>


        {/* footer */}
        
      </div>
    </BrowserRouter>
  );
}

export default App;