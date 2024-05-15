'use client'

// pages/newpage.js

// pages/index.js
import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((res) => res.json());

const newPage = () => {
  const { data, error } = useSWR('/api/allData', fetcher);

  if (!data) return <div>Loading...</div>;
  if (error) return <div>Error fetching data</div>;
  
  const categorizedData = {};
  console.log(data);
  data.data.forEach((item) => {
    if (!categorizedData[item.type]) {
      categorizedData[item.type] = [];
    }
    categorizedData[item.type].push(item);
  });
  console.log(categorizedData);
  return (
      <div>
      <h1>Data Page</h1>
      {Object.keys(categorizedData).map((type) => (
        <div key={type}>
          <h2>{type}</h2>
          {categorizedData[type].map((item) => (
          <pre>{JSON.stringify(item, null, 2)}</pre>
        ))}
        </div>
      ))}
    </div>
  
  );
};

export default newPage;


