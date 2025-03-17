import React from 'react'; 
import { Link } from 'react-router-dom'; 
import logo from "../../asset/navbar/main_logo.svg"; 
import userIcon from "../../asset/navbar/user_icon.svg"; 
import bellIcon from "../../asset/navbar/bell_icon.svg";   

const Navbar = () => {   
  const menuItemClass = "py-1 px-4 text-gray-900 hover:text-green-700 dark:text-white dark:hover:text-blue-500";    
  
  return (     
    <nav className="bg-white border-gray-200 dark:bg-gray-900">       
      <div className="max-w-screen-2xl flex items-center justify-between mx-auto px-8 py-4">         
        <div className="flex items-center ml-0">           
          <Link to="/">               
            <img                 
              src={logo}                 
              alt="어디가농 로고"                 
              className="h-14 self-center cursor-pointer"               
            />             
          </Link>         
        </div>                  
        
        <div className="w-auto flex-grow flex justify-center">           
          <ul className="font-medium flex flex-row space-x-8 rtl:space-x-reverse text-base">             
            <li><a href="#" className={menuItemClass}>지역 추천 받기</a></li>             
            <li><a href="#" className={menuItemClass}>내 작물 수익 계산기</a></li>             
            <li><a href="#" className={menuItemClass}>귀농 매물 보기</a></li>             
            <li><a href="#" className={menuItemClass}>멘토 찾기</a></li>             
            <li><a href="#" className={menuItemClass}>귀농 뉴스</a></li>           
          </ul>         
        </div>          
        
        <div className="flex items-center">         
          <button className="p-2 hover:bg-gray-100 rounded-full">             
              <Link 
                  to="/login" 
                  className="p-2 hover:bg-gray-100 rounded-full"
              >
                  <img
                      src={userIcon}
                      alt="사용자"
                      className="h-6 w-6"
                  />
              </Link>           
          </button>           
          <button className="p-2 hover:bg-gray-100 rounded-full">             
            <img                
              src={bellIcon}                
              alt="알림"                
              className="h-6 w-6"             
            />           
          </button>                   
        </div>       
      </div>     
    </nav>   
  ); 
};  

export default Navbar;