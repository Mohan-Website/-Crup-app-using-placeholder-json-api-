import React, { useEffect, useState } from 'react';
import MaterialTable from 'material-table';
import './App.css';
import axios from 'axios';





const App = () => {

  const [user, setUser] = useState([]);
  const [iserror, setIserror] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);

  let columns = [
    { title: 'TITLE', field: 'title' },
    { title: 'POST', field: 'body' },
  ]

  

  useEffect(() => {
    axios.get(`https://jsonplaceholder.typicode.com/posts`)
      .then(res => {
        const posts = res.data;
        setUser(posts);
        // console.log(posts);
      })
  }, [])




  const handleRowUpdate = (newData, oldData, resolve) => {

    let errorList = []
 

    if (errorList.length < 1) {
      axios.put(`https://jsonplaceholder.typicode.com/posts/${newData.id}`, newData)
        .then(response => {
          const updateUser = [...user];
          const index = oldData.tableData.id;
          updateUser[index] = newData;
          setUser([...updateUser]);
          resolve()
          setIserror(false)
          setErrorMessages([])
        })
        .catch(error => {
          setErrorMessages(["Update failed! Server error"])
          setIserror(true)
          resolve()

        })
    } else {
      setErrorMessages(errorList)
      setIserror(true)
      resolve()

    }
  }


  
  const handleRowDelete = (oldData, resolve) => {
    axios.delete(`https://jsonplaceholder.typicode.com/posts/${oldData.id}`)
      .then(response => {
        const dataDelete = [...user];
        const index = oldData.tableData.id;
        dataDelete.splice(index, 1);
        setUser([...dataDelete]);
        resolve()
      })
      .catch(error => {
        setErrorMessages(["Delete failed! Server error"])
        setIserror(true)
        resolve()
      })
  }


  
  const handleRowAdd = (newData, resolve) => {
    
    let errorList = []


    if (errorList.length < 1) {
      axios.post(`https://jsonplaceholder.typicode.com/posts`, newData)
        .then(response => {
          let newUserdata = [...user];
          newUserdata.push(newData);
          setUser(newUserdata);
          resolve()
          setErrorMessages([])
          setIserror(false)
        })
        .catch(error => {
          setErrorMessages(["Cannot add data. Server error!"])
          setIserror(true)
          resolve()
        })
    } else {
      setErrorMessages(errorList)
      setIserror(true)
      resolve()
    }
  }


  return (
    <div className="app">
      <h1>Crud App with placeholder Json</h1> <br /><br />

      <MaterialTable
        title="All Post"
        columns={columns}
        data={user}
        options={{
          headerStyle: { borderBottomColor: 'red', borderBottomWidth: '3px', fontFamily: 'verdana' },
          actionsColumnIndex: -1
        }}
        editable={{
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve) => {
              handleRowUpdate(newData, oldData, resolve);

            }),
          onRowAdd: (newData) =>
            new Promise((resolve) => {
              handleRowAdd(newData, resolve)
            }),
          onRowDelete: (oldData) =>
            new Promise((resolve) => {
              handleRowDelete(oldData, resolve)
            }),
        }}
      />

      

    </div>
  );
}

export default App;
