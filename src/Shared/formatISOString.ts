

const formatISOTime = (isoString: string): string => {
    // 1. Create a Date object from the ISO string
    const date = new Date(isoString);

    // 2. Define formatting options using Intl.DateTimeFormat
    const options: Intl.DateTimeFormatOptions = {
        hour: 'numeric',   // e.g., 10 or 4
        minute: '2-digit', // e.g., 05 or 40
        hour12: true,      // Use AM/PM format (12-hour clock)
    };

    // 3. Format the date according to the user's default locale
    // You can replace 'en-US' with navigator.language for better localization
    return date.toLocaleTimeString('en-US', options); 
};

export default formatISOTime