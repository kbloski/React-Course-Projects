import { initialFriends } from "./store";
import { useState } from "react";

function App() {
  const [friends, setFriends] = useState([...initialFriends]);
  const [ showAddFriend, setShowAddFriend ] = useState(false);

  function toggleShowAddFriend(){
    setShowAddFriend( show => !show)
  }

  function handleAddFriend( name, imgUrl ){
    const newFriend = {
      id: Math.floor(Math.random() * 1000000),
      name,
      image: imgUrl,
      balance: 0
    }

    setFriends( friends => [...friends, newFriend] );
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList friends={ friends } />
        <FormAddFriend show={showAddFriend} addFriend={ handleAddFriend } />
        <Button onClick={toggleShowAddFriend}>{ !showAddFriend ? 'Add friend' : 'Cancel'}</Button>
      </div>
      <FormSplitBill />
    </div>
  );
}

export default App;


function FriendsList({ friends }){
  return <ul>
      {friends.map( friend => <Friend friend={friend} key={friend.id}/> )}
    </ul>
}

function Friend({friend}){
  return <li>
    <img src={friend.image} alt={friend.name} />
    <h3>{friend.name}</h3>
    { friend.balance < 0 && 
      <p className="red">
        You owe { friend.name} {Math.abs(friend.balance)}$
      </p>
    }
    { friend.balance > 0 && 
      <p className="green">
        { friend.name} owes you {Math.abs(friend.balance)}$
      </p>
    }
    { friend.balance === 0 && 
      <p>
        You and { friend.name} are even.
      </p>
    }

    <Button>Select</Button>
  </li>
}

function Button( { children, onClick}){
  return <button className="button" onClick={onClick}>{children}</button>
}

function FormAddFriend({ show, addFriend}){
  const [name, setName] = useState('');
  const [ imgUrl, setImgUrl ] = useState('');

  function handleSubmit( e ){
    e.preventDefault();

    addFriend( name, imgUrl);
    setName('')
    setImgUrl('')
    
  }

  return <>
      { show &&
          <form className="form-add-friend" onSubmit={ handleSubmit}>
              <label>@ Friend name</label>
              <input type="text" onChange={e => setName( e.target.value )} value={name}/>

              <label>@ Image Url</label>
              <input type="text" onChange={ e => setImgUrl( e.target.value) } value={imgUrl} />

              <Button >Add</Button>
          </form>
        }
  </>
}

function FormSplitBill(){
  return (
      <form className="form-split-bill">
          <h2>Split a bill with X</h2>

          <form className="form-add-friend">
              <label>@ Bill value</label>
              <input type="text" />

              <label>@ Your expense</label>
              <input type="text" />

              <label>X's Expense</label>
              <input type="text" disabled/>

              <label>Who is playing the bill</label>
              <select>
                <option value='user'>You</option>
                <option value='friend'>X</option>
              </select>

              <Button>Split bill</Button>
          </form>
      </form>
  );
}