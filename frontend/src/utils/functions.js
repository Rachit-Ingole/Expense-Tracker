export function formatDate(dateString) {
        if(!dateString){return}
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        
        const [year, month, day] = dateString.split("-");
        const monthName = months[parseInt(month) - 1];
        
        return `${monthName} ${parseInt(day)}, ${year}`;
}

export function convertTo12HourFormat(timeString) {
        if(!timeString){return}
        const [hour, minute] = timeString.split(":");
        let period = "AM";
        let hour12 = parseInt(hour);
      
        if (hour12 >= 12) {
          period = "PM";
          if (hour12 > 12) {
            hour12 -= 12;
          }
        } else if (hour12 === 0) {
          hour12 = 12;
        }
      
        return `${hour12}:${minute} ${period}`;
}

export function formatToIndianNotation(num){
    if (num >= 10000000) {
      return (num / 10000000).toFixed(1) + "Cr"; 
    } else if (num >= 100000) {
      return (num / 100000).toFixed(1) + "L"; 
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K"; 
    }
    return num.toFixed(2); 
};

export function organizeDataByMonthAndDate(data) {
    const result = {};
  
    const parseDateTime = (item) => {
      const [year, month, day] = item.date.split("-");
      const [hours, minutes] = item.time.split("-");
      return new Date(year, month - 1, day, hours, minutes);
    };
  
    const sortedData = data.sort((a, b) => {
      const dateA = parseDateTime(a);
      const dateB = parseDateTime(b);
      return dateA - dateB;
    });
  
    sortedData.forEach(item => {
      const monthKey = item.date.slice(0, 7); 
      const dateKey = item.date; 
  
      if (!result[monthKey]) {
        result[monthKey] = {};
      }
      if (!result[monthKey][dateKey]) {
        result[monthKey][dateKey] = [];
      }
      result[monthKey][dateKey].push(item); 
    });
  
    return result;
}

export function groupByYearMonth(data) {
  if (!Array.isArray(data)) {
      console.error("Expected an array but got:", data);
      return {}; 
  }
  return data.reduce((acc, record) => {
      const key = `${record.year}-${String(record.month).padStart(2, "0")}`; 
      if (!acc[key]) {
          acc[key] = [];
      }
      acc[key].push(record);
      return acc;
  }, {});
}

export function getUniqueCategories(data) {
  if (!Array.isArray(data)) {
      console.error("Expected an array but got:", data);
      return [];
  }

  const categories = new Set(); 
  data.forEach(record => {
      if (record.category) {
          categories.add(record.category);
      }
  });

  return Array.from(categories); 
}