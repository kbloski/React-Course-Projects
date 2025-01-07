import { initialFriends } from "./store";
import { useState } from "react";

function App() {
  const [friends, setFriends] = useState([...initialFriends]);
  const [ showAddFriend, setShowAddFriend ] = useState(false);
  const [ selectedFriend, setSelectedFriend] = useState(null);

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

    setShowAddFriend( false);
    setFriends( friends => [...friends, newFriend] );
  }

  function handleSelection( friend ){
    setShowAddFriend( false)
    setSelectedFriend( friend );
  }

  function handleSplitBill( value ){
    
    setFriends( friend => friends.map( friend => friend.id === selectedFriend.id ? {
      ...friend,
      balance: friend.balance + value
    } : friend))
    
    setSelectedFriend( null);
  }

  return (
    <div className="app">
      <div className="sidebar" >
        <FriendsList friends={ friends } onSelection={handleSelection} selectedFriend={selectedFriend}/>
        <FormAddFriend show={showAddFriend} addFriend={ handleAddFriend }  />
        <Button onClick={toggleShowAddFriend}>{ !showAddFriend ? 'Add friend' : 'Cancel'}</Button>
      </div>
      { selectedFriend && <FormSplitBill onSplitBill={handleSplitBill } selectedFriend={selectedFriend} />}
    </div>
  );
}

export default App;


function FriendsList({ friends, onSelection, selectedFriend}){
  return <ul>
      {friends.map( friend => <Friend 
        selectedFriend={selectedFriend}
        friend={friend} 
        key={friend.id} 
        onSelection={onSelection}
      /> )}
    </ul>
}

function Friend({friend, onSelection, selectedFriend}){
  const isSelected = selectedFriend?.id === friend.id;

  function handleClick(){
      if (isSelected)return onSelection( null);
      onSelection( friend );
    }

  return <li className={ isSelected ? 'selected' : ''}>

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

    <Button onClick={handleClick}>{ !isSelected ? 'Select' : 'Close'}</Button>
  </li>
}

function Button( { children, onClick}){
  return <button className="button" onClick={onClick}>{children}</button>
}

function FormAddFriend({ show, addFriend}){
  const [name, setName] = useState('');
  const imgDefautlUrl = "https://i.pravatar.cc/48";
  const [imgUrl, setImgUrl] = useState( imgDefautlUrl);

  function handleSubmit( e ){
    e.preventDefault();

    if (!name || !imgUrl) return;

    addFriend( name, imgUrl);
    setName('')
    setImgUrl(imgDefautlUrl)
    
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

function FormSplitBill({ selectedFriend, onSplitBill}){
  const [ bill, setBill] = useState( '');
  const [paidByUser, setPaidByUser] = useState('');
  const paidByFriend = bill ? bill - paidByUser : 0;
  const [whoIsPaying, setWhoIsPaying] = useState('user');

  function handleSubmit( e ){
    e.preventDefault();

    if(!bill || !paidByFriend) return;

    onSplitBill(whoIsPaying === 'user' ? paidByFriend : -paidByUser);


  }

  return (
      <form className="form-split-bill" onSubmit={handleSubmit}>
          <h2>Split a bill with {selectedFriend.name}</h2>

              <label>@ Bill value</label>
              <input
                  type="text"
                  value={bill}
                  onChange={(e) => setBill(Number(e.target.value))}
              />

              <label>@ Your expense</label>
              <input
                  type="text"
                  value={paidByUser}
                  onChange={(e) => setPaidByUser(
                    Number(e.target.value) > bill ? paidByUser : 
                    Number(e.target.value)
                  )}
              />

              <label>@ {selectedFriend.name}'s Expense</label>
              <input type="text" disabled value={ paidByFriend}/>

              <label>Who is playing the bill</label>
              <select 
                value={whoIsPaying} 
                onChange={(e) => setWhoIsPaying(e.target.value) }
              >
                  <option value="user">You</option>
                  <option value="friend">{selectedFriend.name}</option>
              </select>

              <Button>Split bill</Button>
      </form>
  );
}