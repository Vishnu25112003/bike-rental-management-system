export const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  export const truncateText = (text, length = 20) => {
    return text.length > length ? text.slice(0, length) + '...' : text;
  };
  