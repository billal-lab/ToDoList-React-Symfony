import React, {Component} from 'react'

export default class List extends Component{
    constructor(){
        super();
        this.state={
            newTodo:"",
            todos: []
        }
        this.onChangeHandler = this.onChangeHandler.bind(this)
        this.onSubmitHandler = this.onSubmitHandler.bind(this)
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
                todos: ul
            })
        }
    }
    render(){
        return (
            <div>
                <div className="row mt-5">
                    <textarea type = "text" value={this.state.newTodo} onChange={this.onChangeHandler}/>
                </div>
                <div className="row mt-5">
                    <input className="btn btn-primary block" type = "button" value="Submit" onClick={this.onSubmitHandler}/>
                </div>
                <div className="row mt-5">
                    <ul>
                        {this.state.newTodo !== "" ? <li>{this.state.newTodo}</li> : ""}
                        {this.state.todos.map((todo)=>(<li key={todo.id}>{todo.content}</li>)) }
                    </ul>
                </div>
            </div>
        );
    }
}