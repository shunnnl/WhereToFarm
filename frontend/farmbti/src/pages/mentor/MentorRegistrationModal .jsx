// MentorRegistrationModal.jsx
import React from 'react';
import Modal from 'react-modal';
import { useState } from 'react';

const MentorRegistrationModal  = ({ isOpen, onRequestClose }) => {

  const [selectedYear, setSelectedYear] = useState('1999');
  const [selectedMonth, setSelectedMonth] = useState('12');
  const [selectedDay, setSelectedDay] = useState('12');
  const [selectedFoods, setSelectedFoods] = useState([]);
  const [description, setDescription] = useState('');
  const [formData, setFormData] = useState({
    Year: '',
    Month: '',
    Day: ''
  });
  
  

  const topFood = [
    { id: 'apple', label: 'apple', iconSrc: '/assets/mentor/icons/apple.png' },
    { id: 'cucumber', label: 'cucumber', iconSrc: '/assets/mentor/icons/cucumber.png' },
    { id: 'grape', label: 'grape', iconSrc: '/assets/mentor/icons/grape.png' },
    { id: 'greenonion', label: 'greenonion', iconSrc: '/assets/mentor/icons/greenonion.png' },
    { id: 'lettuce', label: 'lettuce', iconSrc: '/assets/mentor/icons/lettuce.png' },
    { id: 'onion', label: 'onion', iconSrc: '/assets/mentor/icons/onion.png' },
    { id: 'pear', label: 'pear', iconSrc: '/assets/mentor/icons/pear.png' },
    { id: 'sweetpotato', label: 'sweetpotato', iconSrc: '/assets/mentor/icons/sweetpotato.png' },
    { id: 'tangerine', label: 'tangerine', iconSrc: '/assets/mentor/icons/tangerine.png' },
    { id: 'watermelon', label: 'watermelon', iconSrc: '/assets/mentor/icons/watermelon.png' }
  ];

  const toggleFood = (id) => {
    if (selectedFoods.includes(id)) {
      setSelectedFoods(selectedFoods.filter(type => type !== id));
    } else {
      setSelectedFoods([...selectedFoods,id]);
    }
  };

  const handleDescriptionChange = (e) => {
    const text = e.target.value;
    if (text.length <= 100) {
      setDescription(text);
    }
  };

  const handleChange = (e) => {
    console.log("e = ", e)
    const { name, value } = e.target;
    setFormData(prevState => ({
    ...prevState,
    [name]: value
    }));

    console.log("formData = ", formData)
};


  // 연도 옵션 생성 (현재 연도부터 100년 전까지)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from(
    { length: 100 }, 
    (_, i) => currentYear - i
  );

  // 월 옵션
  const monthOptions = Array.from(
    { length: 12 }, 
    (_, i) => i + 1
  );

  // 일 옵션 (선택된 월에 따라 동적으로 변경 가능)
  const getDaysInMonth = (year, month) => {
    return new Date(year, month, 0).getDate();
  };

  const dayOptions = formData.Year && formData.Month
    ? Array.from(
        { length: getDaysInMonth(formData.Year, formData.Month) }, 
        (_, i) => i + 1
      )
    : Array.from({ length: 31 }, (_, i) => i + 1);


  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="bg-white p-6 rounded shadow-md max-w-md mx-auto mt-20"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <h2 className="text-xl font-bold">멘토 등록</h2>
      <p className="text-gray-600 text-sm">성공적인 자신의 귀농 스토리를 들려주고 싶지 않나요?</p>
        <p className="text-gray-600 text-sm">멘토로 등록한 후, 멘티들과 많은 이야기를 나누어보세요!</p>

      <div className="mb-8">
        {/* 날짜선택 */}
        <h3 className="text-lg font-medium mb-4 mt-8">귀농 등록</h3>
        <div className="flex space-x-4">
              <div className="grid grid-cols-3 gap-4">
                <select
                  name="Year"
                  value={formData.Year}
                  onChange={handleChange}
                  required
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">연도</option>
                  {yearOptions.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
                <select
                  name="Month"
                  value={formData.Month}
                  onChange={handleChange}
                  required
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">월</option>
                  {monthOptions.map(month => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
                <select
                  name="Day"
                  value={formData.Day}
                  onChange={handleChange}
                  required
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">일</option>
                  {dayOptions.map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>

        </div>

      </div>
      <button
        className="mt-4 bg-red-500 text-white py-2 px-4 rounded"
        onClick={onRequestClose}
      >
        닫기
      </button>
    </Modal>
  );
};

export default MentorRegistrationModal;