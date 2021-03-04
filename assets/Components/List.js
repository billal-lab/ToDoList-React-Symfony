import React, {Component} from 'react'

export default class List extends Component{
    constructor(){
        super();
        this.state={
            newTodo:"",
            messages: null,
            todos: []
        }
        this.onChangeHandler = this.onChangeHandler.bind(this)
        this.onSubmitHandler = this.onSubmitHandler.bind(this)
        this.displayMessage = this.displayMessage.bind(this)
        this.displayTodos = this.displayTodos.bind(this)
    }

    componentDidMount(){
        const request = new Request('http://localhost:8000/todo');
        fetch(request)
            .then(response => response.json())
            .then(data => this.setState({todos: data}))
    }
    onChangeHandler = (event)=>{
        this.setState({
            newTodo: event.target.value
        })
    }

    onSubmitHandler = (event)=>{
        var l = this.state.todos
        var n = {
            content : this.state.newTodo
        }

        var otherPara = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body : JSON.stringify(n)
        }

        fetch("http://localhost:8000/todo/new", otherPara)
            .then(res => res.json())
            .then(res => this.controle(res, l, n))

        this.setState({
            newTodo:""
        })
    }

    controle(response, ul, li){
        if(response.status==201){
            li.id = response.newId
            ul.unshift(li)
            this.setState({
                todos: ul,
                messages:{
                    cls: "alert alert-success text-center",
                    content: "One todo have been added !"
                }
            })
        }else{
            this.setState({
                messages:{
                    cls: "alert alert-danger text-center",
                    content: "Something is wrong !"
                }
            })
        }
    }

    displayMessage(){
        setTimeout(()=>{this.setState({messages:null})},4000);
        return (
            <div className={this.state.messages.cls}>
                    <strong>{this.state.messages.content}</strong>
            </div>
        );
    }
    displayTodos(){
        return(
            <div>
                {this.state.todos.map((todo)=>(<li key={todo.id}>{todo.content}</li>)) }
            </div>
        );
    }
    render(){
        return (
            <div className="mt-3">
                {this.state.messages == null? "": this.displayMessage()}
                <div className="row mt-5">
                    <textarea type = "text" value={this.state.newTodo} onChange={this.onChangeHandler}/>
                </div>
                <div className="row mt-2">
                    <input className="btn btn-primary block" type = "button" value="Submit" onClick={this.onSubmitHandler}/>
                </div>
                <div className="row mt-5">
                    <ul>
                        {this.state.newTodo !== "" ? <li className="mb-2 text-secondary">{this.state.newTodo}</li> : ""}
                        {this.state.todos.length<1? <h3 className="text-center">Nothing to display</h3> : this.displayTodos()}
                    </ul>
                </div>
            </div>
        );
    }
}