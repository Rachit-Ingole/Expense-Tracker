import React, { useState } from 'react';
import { api_url } from '../../utils/variables';

export default function EmailReminder(){
  const [formData, setFormData] = useState({
    recipient: '',
    remind_of: '',
    schedule_datetime: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = new FormData();
    data.append('recipient', formData.recipient);
    data.append('remind_of', formData.remind_of);
    data.append('schedule_datetime', formData.schedule_datetime);
    data.append('subject', "BILL PAYMENT EMAIL REMINDER"); // optional, if you want to override default subject
    
    try {
      const response = await axios.post(`${api_url}/schedule-email/`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      });
      console.log('Email scheduled successfully:', response.data);
    } catch (error) {
      console.error('Error scheduling email:', error.response?.data);
    }
  };

  return (
    <div className='flex flex-col justify-center items-center mt-[10px] text-lg p-3 w-full sm:w-[75%] h-[80vh] bg-slate-200 rounded-xl m-auto' >
        <h2 className='mb-[50px] font-semibold'>Email Reminder</h2>
        <form className='flex flex-col gap-[20px]' onSubmit={handleSubmit}>
        <input className='bg-white rounded-lg p-2'
            type="text"
            name="recipient"
            placeholder="Recipient"
            onChange={handleInputChange}
            value={formData.recipient}
        />
        <input className='bg-white rounded-lg p-2'
            type="text"
            name="remind_of"
            placeholder="Remind Of"
            onChange={handleInputChange}
            value={formData.remind_of}
        />
        <input className='bg-white rounded-lg p-2'
            type="text"
            name="schedule_datetime"
            placeholder="DD-MM-YYYY HH:MM"
            onChange={handleInputChange}
            value={formData.schedule_datetime}
        />
        <button type="submit" className='bg-blue-500 rounded-lg text-white p-3'>Schedule Email</button>
        </form>
    </div>
  );
};
