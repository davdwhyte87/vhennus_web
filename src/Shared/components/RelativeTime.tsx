
import { useMemo } from 'react';
import { formatDistanceToNow } from 'date-fns';


interface RelativeTimeProps {
  date: string | Date | undefined;
}

const RelativeTime: React.FC<RelativeTimeProps> = ({ date }) => {
    if(date == undefined || date == null || date == ""){
        return <span>Unknown time</span>;
    }
  const relativeTime = useMemo(() => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  }, [date]);

  return <span>{relativeTime}</span>;
};

export default RelativeTime;