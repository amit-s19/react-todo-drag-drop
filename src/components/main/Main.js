import React, { useEffect, useRef, useState } from 'react';
import './Main.css';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import _ from "lodash";
import { v4 } from "uuid";
import { Alert, Button, Form, Image } from 'react-bootstrap';
import axios from 'axios';
import Bin from '../../assets/binTrans.png';
import Modal from 'react-modal';
import saundarya from '../../assets/saundarya.png';
import loader from '../../assets/loader.gif';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    },
};

const loaderStyle = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'transparent',
        border: 'none'
    },
};

const mountedStyle = { animation: "inAnimation 300ms ease-in" };
const unmountedStyle = {
    animation: "outAnimation 0ms ease-out",
    animationFillMode: "forwards"
};

Modal.setAppElement('#root');

function Main() {
    const [text, setText] = useState("")
    const [desc, setDesc] = useState("")
    const [showTodoAdd, setShowTodoAdd] = useState(false);
    const [showInprogressAdd, setShowInprogressAdd] = useState(false);
    const [showDoneAdd, setShowDoneAdd] = useState(false);
    const [userName, setUserName] = useState("");
    const [modalIsOpen, setIsOpen] = React.useState(false);
    const [itemToDelete, setItemToDelete] = useState({});
    const [itemToEdit, setItemToEdit] = useState({});
    const [editingTodo, setEditingTodo] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [newDesc, setNewDesc] = useState("");
    const [loading, setLoading] = useState(false);
    const [state, setState] = useState({
        "todo": {
            title: "To do",
            items: []
        },
        "in-progress": {
            title: "In Progress",
            items: []
        },
        "done": {
            title: "Completed",
            items: []
        }
    })

    function openModal(el) {
        setItemToDelete(el);
        setIsOpen(true);
    }

    function closeModal() {
        setEditingTodo(false);
        setIsOpen(false);
    }

    useEffect(() => {
        async function getTodoData() {
            setLoading(true);
            let todoData = await axios.get("https://limitless-beach-71421.herokuapp.com/api/users/getTodo");
            console.log(todoData.data);
            let userName = await localStorage.getItem("userName");
            console.log(userName);
            setUserName(userName);
            todoData.data.forEach(todo => {
                if (todo.status === "todo") {
                    setState(prev => {
                        return {
                            ...prev,
                            todo: {
                                title: "To do",
                                items: [todo, ...prev.todo.items]
                            }
                        }
                    })
                } else if (todo.status === "in-progress") {
                    setState(prev => {
                        return {
                            ...prev,
                            "in-progress": {
                                title: "In Progress",
                                items: [todo, ...prev['in-progress'].items]
                            }
                        }
                    })
                } else {
                    setState(prev => {
                        return {
                            ...prev,
                            done: {
                                title: "Completed",
                                items: [todo, ...prev.done.items]
                            }
                        }
                    })
                }
            })
            setLoading(false);
        }
        getTodoData();
    }, [])


    const handleDragEnd = async ({ destination, source }) => {
        if (!destination) {
            return
        }

        if (destination.index === source.index && destination.droppableId === source.droppableId) {
            return
        }

        console.log(destination, source)

        // Creating a copy of item before removing it from state
        const itemCopy = { ...state[source.droppableId].items[source.index] }
        itemCopy.status = destination.droppableId;

        setState(prev => {
            prev = { ...prev }
            // Remove from previous items array
            prev[source.droppableId].items.splice(source.index, 1)


            // Adding to new items array location
            prev[destination.droppableId].items.splice(destination.index, 0, itemCopy)

            return prev
        })

        let addResponse = await axios.post("https://limitless-beach-71421.herokuapp.com/api/users/dragTodo", {
            id: itemCopy.id,
            status: itemCopy.status,
        });

        if (addResponse.data.n === 0) {
            alert("Failed to change todo status due to an internal error!")
        }
    }

    const addItem = async (type) => {
        try {
            setLoading(true);
            if (text.length === 0 || desc.length === 0)
                return
            if (type === "todo") {
                const todo = {
                    id: v4(),
                    title: text,
                    desc: desc,
                    status: "todo",
                    createdBy: userName,
                    date: new Date(Date.now()).toLocaleString().split(',')[0]

                };
                let addResponse = await axios.post("https://limitless-beach-71421.herokuapp.com/api/users/addTodo", {
                    id: v4(),
                    title: text,
                    desc: desc,
                    status: "todo",
                    createdBy: userName,
                    date: new Date(Date.now()).toLocaleString().split(',')[0]
                });
                if (addResponse.status === 200)
                    setState(prev => {
                        return {
                            ...prev,
                            todo: {
                                title: "To do",
                                items: [todo, ...prev.todo.items
                                ]
                            }
                        }
                    })
                setShowTodoAdd(false);
            }
            else if (type === "in-progress") {
                const todo = {
                    id: v4(),
                    title: text,
                    desc: desc,
                    status: "in-progress",
                    createdBy: userName,
                    date: new Date(Date.now()).toLocaleString().split(',')[0]

                };
                let addResponse = await axios.post("https://limitless-beach-71421.herokuapp.com/api/users/addTodo", {
                    id: v4(),
                    title: text,
                    desc: desc,
                    status: "in-progress",
                    createdBy: userName,
                    date: new Date(Date.now()).toLocaleString().split(',')[0]
                });
                if (addResponse.status === 200)
                    setState(prev => {
                        return {
                            ...prev,
                            "in-progress": {
                                title: "In Progress",
                                items: [
                                    todo,
                                    ...prev['in-progress'].items
                                ]
                            }
                        }
                    })
                setShowInprogressAdd(false);
            }
            else {
                const todo = {
                    id: v4(),
                    title: text,
                    desc: desc,
                    status: "done",
                    createdBy: userName,
                    date: new Date(Date.now()).toLocaleString().split(',')[0]

                };
                let addResponse = await axios.post("https://limitless-beach-71421.herokuapp.com/api/users/addTodo", {
                    id: v4(),
                    title: text,
                    desc: desc,
                    status: "done",
                    createdBy: userName,
                    date: new Date(Date.now()).toLocaleString().split(',')[0]
                });
                if (addResponse.status === 200)
                    setState(prev => {
                        return {
                            ...prev,
                            done: {
                                title: "Completed",
                                items: [
                                    todo,
                                    ...prev.done.items
                                ]
                            }
                        }
                    })
                setShowDoneAdd(false);
            }
        } catch (err) {
            console.log(err);
        }
        setLoading(false);
        setText("")
        setDesc("");
    }

    const removeTodo = async (id) => {
        try {
            let delResponse = await axios.post("https://limitless-beach-71421.herokuapp.com/api/users/removeTodo", {
                id: id
            });
            window.location.reload();
        } catch (err) {
            alert("An error occured while deleting todo!")
            console.log(err);
        }
    }

    const shouldUpdateTodo = () => {
        if (newTitle.length === 0 || newDesc.length === 0)
            return false
        if (newTitle !== itemToEdit.title || newDesc !== itemToEdit.desc)
            return true
        return false
    }

    const startEditingTodo = (el) => {
        if (!editingTodo) {
            setItemToEdit(el);
            setNewTitle(el.title);
            setNewDesc(el.desc);
            setEditingTodo(true);
        }
    }

    const updateTodo = async () => {
        try {
            setLoading(true)
            const todoArray = state[itemToEdit.status].items;
            const newTodoArray = todoArray.map(todo =>
                todo.id === itemToEdit.id
                    ? { ...todo, title: newTitle, desc: newDesc }
                    : todo
            );

            let updateResponse = await axios.post("https://limitless-beach-71421.herokuapp.com/api/users/updateTodo", {
                id: itemToEdit.id,
                newTitle: newTitle,
                newDesc: newDesc
            });

            console.log(updateResponse.status);

            if (itemToEdit.status === "todo") {
                setState(prev => {
                    return {
                        ...prev,
                        todo: {
                            title: "To do",
                            items: newTodoArray
                        }
                    }
                })
            } else if (itemToEdit.status === "in-progress") {
                setState(prev => {
                    return {
                        ...prev,
                        "in-progress": {
                            title: "In Progress",
                            items: newTodoArray
                        }
                    }
                })
            } else {
                setState(prev => {
                    return {
                        ...prev,
                        done: {
                            title: "Completed",
                            items: newTodoArray
                        }
                    }
                })
            }
        }
        catch (err) {
            alert("An error occured while updating todo!")
        }
        setEditingTodo(false);
        setNewTitle("");
        setNewDesc("");
        setItemToEdit({});
        setLoading(false)
    }

    return (
        <div className="Main" style={{ marginTop: (showDoneAdd || showInprogressAdd || showTodoAdd) ? 120 : 0 }}>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Example Modal"
            >
                <div style={{ padding: 50, borderRadius: 50 }}>
                    <h5 >Are you sure to delete?</h5>
                    <div
                        className={"item"}
                    >
                        <div>
                            <p style={{ fontSize: 14, fontWeight: 700 }}>{itemToDelete.title}</p>
                        </div>
                        <div>
                            <p style={{ fontSize: 14, marginTop: -5 }}>{itemToDelete.desc}</p>
                        </div>
                        <div style={{ display: 'flex', position: 'relative' }}>
                            <div>
                                <p style={{ fontSize: 11, color: 'rgba(0,0,0,0.5)' }}>{itemToDelete.createdBy}</p>
                                <p style={{ fontSize: 11, color: 'rgba(0,0,0,0.5)', marginTop: -15 }}>{itemToDelete.date}</p>
                            </div>
                        </div>
                    </div>
                    <div style={{ marginTop: 20 }}>
                        <Button onClick={closeModal} style={{ backgroundColor: '#fff', borderColor: "#329C89", marginRight: 10, color: "#329C89" }}>Cancel</Button>
                        <Button onClick={() => { removeTodo(itemToDelete.id) }} style={{ backgroundColor: '#329C89', borderColor: "#329C89" }}>Delete</Button>
                    </div>
                </div>
            </Modal>
            <Modal
                isOpen={loading}
                onRequestClose={closeModal}
                style={loaderStyle}
            >
                <div>
                    <img src={loader} />
                </div>
            </Modal>
            <DragDropContext onDragEnd={handleDragEnd}>
                <div key={"todo"} className={"column"}>
                    <div className="todoTitle">
                        <h5 style={{ marginRight: '65%' }}>{state.todo.title}</h5>
                        <div className="todoCount"><p>{state.todo.items.length}</p></div>
                    </div>
                    {
                        showTodoAdd ?
                            <div className="todoInput">
                                <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Give your task a title" />
                                <textarea type="text" value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Description..." />
                                <div style={{ marginLeft: 10 }}>
                                    <Button onClick={() => { setShowTodoAdd(false); setText(""); setDesc("") }} style={{ backgroundColor: '#fff', borderColor: "#329C89", marginRight: 10, color: "#329C89" }}>Cancel</Button>
                                    <Button onClick={() => { addItem("todo") }} style={{ backgroundColor: '#329C89', borderColor: "#329C89" }}>Add</Button>
                                </div>
                            </div>
                            :
                            <Button style={{
                                width: '85%',
                                marginLeft: 20,
                                backgroundColor: "#ECF3F3",
                                borderColor: '#ECF3F3',
                                color: "#329C89",
                                fontSize: 16,
                                fontWeight: 700
                            }} onClick={() => { if (!editingTodo) setShowTodoAdd(true) }}>+</Button>
                    }

                    <Droppable droppableId={"todo"}>
                        {(provided, snapshot) => {
                            return (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className={"droppable-col"}
                                    id={"droppable-col"}
                                >
                                    {state.todo.items.map((el, index) => {
                                        return (
                                            <Draggable key={el.id} index={index} draggableId={el.id}>
                                                {(provided, snapshot) => {

                                                    // console.log(snapshot)
                                                    return (
                                                        <div
                                                            className={`item ${snapshot.isDragging && "dragging"}`}
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            onClick={() => { startEditingTodo(el); }}


                                                        >
                                                            <div>
                                                                <p style={{ fontSize: 14, fontWeight: 700 }}>{el.title}</p>
                                                            </div>
                                                            <div>
                                                                <p style={{ fontSize: 14, marginTop: -5 }} className="todoP">{el.desc}</p>
                                                            </div>
                                                            <div style={{ display: 'flex', position: 'relative' }}>
                                                                <div>
                                                                    <p style={{ fontSize: 11, color: 'rgba(0,0,0,0.5)' }}>{el.createdBy}</p>
                                                                    <p style={{ fontSize: 11, color: 'rgba(0,0,0,0.5)', marginTop: -15 }}>{el.date}</p>
                                                                </div>
                                                                <div style={{ position: 'absolute', right: 0 }}>
                                                                    <img src={Bin} style={{ height: 30, opacity: 0.6 }} onClick={() => { if (!editingTodo) { openModal(el) } }} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                }}
                                            </Draggable>
                                        )
                                    })}
                                    {provided.placeholder}
                                </div>
                            )
                        }}
                    </Droppable>
                </div>
                <div key={"in-progress"} className={"column"}>
                    <div className="todoTitle">
                        <h5 style={{ marginRight: '43%' }}>{state['in-progress'].title}</h5>
                        <div className="todoCount"><p>{state['in-progress'].items.length}</p></div>
                    </div>
                    {
                        showInprogressAdd ?
                            <div className="todoInput">
                                <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Give your task a title" />
                                <textarea type="text" value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Description..." />

                                <div style={{ marginLeft: 10 }}>
                                    <Button onClick={() => { setShowInprogressAdd(false); setText(""); setDesc("") }} style={{ backgroundColor: '#fff', borderColor: "#329C89", marginRight: 10, color: "#329C89" }}>Cancel</Button>
                                    <Button onClick={() => { addItem("in-progress") }} style={{ backgroundColor: '#329C89', borderColor: "#329C89" }}>Add</Button>
                                </div>
                            </div>
                            :
                            <Button style={{
                                width: '85%',
                                marginLeft: 20,
                                backgroundColor: "#ECF3F3",
                                borderColor: '#ECF3F3',
                                color: "#329C89",
                                fontSize: 16,
                                fontWeight: 700
                            }} onClick={() => { if (!editingTodo) setShowTodoAdd(true) }}>+</Button>

                    }
                    <Droppable droppableId={"in-progress"}>
                        {(provided, snapshot) => {
                            return (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className={"droppable-col"}
                                    id={"droppable-col"}
                                >
                                    {state['in-progress'].items.map((el, index) => {
                                        return (
                                            <Draggable key={el.id} index={index} draggableId={el.id}>
                                                {(provided, snapshot) => {

                                                    // console.log(snapshot)
                                                    return (
                                                        <div
                                                            className={`item ${snapshot.isDragging && "dragging"}`}
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            onClick={() => { startEditingTodo(el); }}


                                                        >
                                                            <div>
                                                                <p style={{ fontSize: 14, fontWeight: 700 }}>{el.title}</p>
                                                            </div>
                                                            <div>
                                                                <p style={{ fontSize: 14, marginTop: -5 }} className="todoP">{el.desc}</p>
                                                            </div>
                                                            <div style={{ display: 'flex', position: 'relative' }}>
                                                                <div>
                                                                    <p style={{ fontSize: 11, color: 'rgba(0,0,0,0.5)' }}>{el.createdBy}</p>
                                                                    <p style={{ fontSize: 11, color: 'rgba(0,0,0,0.5)', marginTop: -15 }}>{el.date}</p>
                                                                </div>
                                                                <div style={{ position: 'absolute', right: 0 }}>
                                                                    <img src={Bin} style={{ height: 30, opacity: 0.6 }} onClick={() => { if (!editingTodo) { openModal(el) } }} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                }}
                                            </Draggable>
                                        )
                                    })}
                                    {provided.placeholder}
                                </div>
                            )
                        }}
                    </Droppable>
                </div>
                <div key={"done"} className={"column"}>
                    <div className="todoTitle">
                        <h5 style={{ marginRight: '43%' }}>{state.done.title}</h5>
                        <div className="todoCount"><p>{state.done.items.length}</p></div>
                    </div>
                    {
                        showDoneAdd ?
                            <div className="todoInput">
                                <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Give your task a title" />
                                <textarea type="text" value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Description..." />

                                <div style={{ marginLeft: 10 }}>
                                    <Button onClick={() => { setShowDoneAdd(false); setText(""); setDesc("") }} style={{ backgroundColor: '#fff', borderColor: "#329C89", marginRight: 10, color: "#329C89" }}>Cancel</Button>
                                    <Button onClick={() => { addItem("done") }} style={{ backgroundColor: '#329C89', borderColor: "#329C89" }}>Add</Button>
                                </div>
                            </div>
                            :
                            <Button style={{
                                width: '85%',
                                marginLeft: 20,
                                backgroundColor: "#ECF3F3",
                                borderColor: '#ECF3F3',
                                color: "#329C89",
                                fontSize: 16,
                                fontWeight: 700
                            }} onClick={() => { if (!editingTodo) setShowTodoAdd(true) }}>+</Button>

                    }
                    <Droppable droppableId={"done"}>
                        {(provided, snapshot) => {
                            return (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className={"droppable-col"}
                                    id={"droppable-col"}
                                >
                                    {state.done.items.map((el, index) => {
                                        return (
                                            <Draggable key={el.id} index={index} draggableId={el.id}>
                                                {(provided, snapshot) => {

                                                    // console.log(snapshot)
                                                    return (
                                                        <div
                                                            className={`item ${snapshot.isDragging && "dragging"}`}
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            onClick={() => { startEditingTodo(el); }}

                                                        >
                                                            <div>
                                                                <p style={{ fontSize: 14, fontWeight: 700 }}>{el.title}</p>
                                                            </div>
                                                            <div>
                                                                <p style={{ fontSize: 14, marginTop: -5 }} className="todoP">{el.desc}</p>
                                                            </div>
                                                            <div style={{ display: 'flex', position: 'relative' }}>
                                                                <div>
                                                                    <p style={{ fontSize: 11, color: 'rgba(0,0,0,0.5)' }}>{el.createdBy}</p>
                                                                    <p style={{ fontSize: 11, color: 'rgba(0,0,0,0.5)', marginTop: -15 }}>{el.date}</p>
                                                                </div>
                                                                <div style={{ position: 'absolute', right: 0 }}>
                                                                    <img src={Bin} style={{ height: 30, opacity: 0.6 }} onClick={() => { if (!editingTodo) { openModal(el) } }} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                }}
                                            </Draggable>
                                        )
                                    })}
                                    {provided.placeholder}
                                </div>
                            )
                        }}
                    </Droppable>
                </div>
            </DragDropContext>

            <div class="edit-todo" style={(editingTodo && !modalIsOpen) ? mountedStyle : unmountedStyle}>
                <div class="edit-todo-title">
                    <input value={newTitle} id="editTitle" onChange={(e) => setNewTitle(e.target.value)} placeholder="New title for todo"></input>
                    <div style={{ marginTop: 10, marginLeft: 5, width: 30, backgroundColor: '#329C89', height: 4, borderRadius: 30 }}></div>

                </div>
                <div class="edit-todo-desc">
                    <div class="created-by">
                        <p style={{ display: 'inline-block' }}>Created By</p>
                        <div style={{ paddingLeft: 40, display: 'inline-block' }}>
                            <p><img src={saundarya} className="tabIcon" />{itemToEdit.createdBy}</p>
                        </div>
                    </div>
                    <div class="description">
                        <p style={{ display: 'inline-block' }}>Description</p>
                        <div >
                            <textarea id="editDesc" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="New description for todo"></textarea>
                        </div>
                    </div>
                </div>
                <div id="editButtons">
                    <Button onClick={() => { setEditingTodo(false) }} style={{ backgroundColor: '#fff', borderColor: "#329C89", marginRight: 10, color: "#329C89" }}>Cancel</Button>
                    <Button onClick={() => { updateTodo() }} style={{ backgroundColor: '#329C89', borderColor: "#329C89" }} disabled={!shouldUpdateTodo()}>Update</Button>
                </div>
            </div>

        </div>
    );
}

export default Main;