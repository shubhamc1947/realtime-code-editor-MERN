import React, { useState } from "react";
import './codetab.scss'
const CodeTab = () => {
  const [isActiveId, setIsActiveId] = useState(1);
  const [datas, setDatas] = useState([
    {
      id: 1,
      heading: "Coding heading one",
      code: "function (){console.log('hello')}",
      lang: "JavaScript",
    },
    {
      id: 2,
      heading: "Coding heading two",
      code: "function (){console.log('hello two')}",
      lang: "CSS",
    },
    {
      id: 3,
      heading: "Coding heading Three",
      code: "function (){console.log('hello three')}",
      lang: "Ok HEllo",
    },
    {
      id: 4,
      heading: "Coding heading Four",
      code: "function (){console.log('hello Four')}",
      lang: "HTML",
    },
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDatas(prev =>
      prev.map(data =>
        data.id === isActiveId ? { ...data, [name]: value } : data
      )
    );
  };

  const addTab = () => {
    const newId = datas.length > 0 ? datas[datas.length - 1].id + 1 : 1;
    const newTab = {
      id: newId,
      heading: `Coding heading ${newId}`,
      code: "",
      lang: "",
    };
    setDatas(prev => [...prev, newTab]);
    setIsActiveId(newId);
  };

  const removeTab = (id) => {
    const newDatas = datas.filter(data => data.id !== id);
    setDatas(newDatas);

    if (newDatas.length === 0) {
      setIsActiveId(null);
    } else if (id === isActiveId) {
      setIsActiveId(newDatas[0].id);
    }
  };

  return (
    <div className="codetab">
      <div className="codetabwrap">
        <div className="tabnav">
          {datas.map((data) => (
            <div key={data.id} className={data.id === isActiveId ? "tab active" : "tab"}>
              <button onClick={() => setIsActiveId(data.id)}>
                data tab {data.id}
              </button>
              <button onClick={() => removeTab(data.id)} className="close-btn">x</button>
            </div>
          ))}
          <button onClick={addTab}>Add Tab</button>
        </div>
        {datas.filter(data => data.id === isActiveId).map(data => (
          <div className="tabinfo active" key={data.id}>
            <h1>
              <input type="text" name="heading" value={data.heading} onChange={handleChange} />
            </h1>
            <h4>
              <input type="text" name="lang" value={data.lang} onChange={handleChange} />
            </h4>
            <textarea rows={10} name="code" onChange={handleChange} value={data.code} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CodeTab;
