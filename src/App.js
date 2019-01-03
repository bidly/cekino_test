import * as React from "react";
import {Store, DataGrid, Message, Input} from 'karcin-ui';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Axios from 'axios';
import { Scrollbars } from 'react-custom-scrollbars';


class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            modal: false,
            modal2: false,
            nestedModal: false,
            closeAll: false,
            selectedIndex: 0,

            fields: [
                {
                    "type": "string",
                    "name": "name",
                    "label": "İsim"
                },
                {
                    "type": "string",
                    "name": "surname",
                    "label": "Soyisim"
                },
                {
                    "type": "int",
                    "name": "tckn",
                    "label": "T.C. Kimlik Numarası"
                }
            ],
            store: new Store({
                idField: 'tckn',
                data: [
                    {name:'John', surname:'Doe', tckn:'12345678910'},
                    {name:'abc', surname:'efg', tckn:'10987654321'},


                ]
            })
        };
        this.toggle = this.toggle.bind(this);
        this.toggle2 = this.toggle2.bind(this);
        this.toggleNested = this.toggleNested.bind(this);
        this.toggleAll = this.toggleAll.bind(this);
        this.addNewRecord = this.addNewRecord.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
        this.editUser = this.editUser.bind(this);

    }

    toggle() {
        this.setState({
            modal: !this.state.modal
        });
    }

    addNewRecord(event) {
        for (var i = 0; i<this.state.store.props.data.length; i++)
        {
            if(this.state.store.props.data[i].tckn === event[0].tckn)
            {
                this.setState({selectedIndex: i})
                break;
            }

        }
        console.log(event[0])
        this.toggle2()
    }

    handleChange(event) {
        console.log(event)
    }

    handleSubmit(event) {
        event.preventDefault()
        console.log(event)
        var flag = true
        for (var i = 0; i<this.state.store.props.data.length; i++)
        {
            if(this.state.store.props.data[i].tckn === event.target.tckn.value)
            {
                alert("Bu kimlik zaten kayıtlı")
                flag = false
                break;
            }

        }

        if(flag)
        {
            this.state.store.props.data.push({
                name:event.target.name.value,
                surname:event.target.surname.value,
                tckn:event.target.tckn.value
            })
        }
        this.toggle()
    }

    toggle2() {
        this.setState({
            modal2: !this.state.modal2
        });
    }

    toggleNested() {
        this.setState({
            nestedModal: !this.state.nestedModal,
            closeAll: false
        });
    }

    toggleAll() {
        this.setState({
            nestedModal: !this.state.nestedModal,
            closeAll: true
        });
    }

    deleteUser() {
        this.state.store.props.data.splice(this.state.selectedIndex, 1)
        this.toggle2()
        this.setState({selectedIndex: 0})
    }

    editUser(event) {
        event.preventDefault()
        this.state.store.props.data[this.state.selectedIndex].name = event.target.name2.value
        this.state.store.props.data[this.state.selectedIndex].surname = event.target.surname2.value
        this.state.store.props.data[this.state.selectedIndex].tckn = event.target.tckn2.value
        this.setState({
            modal2: !this.state.modal2,
            nestedModal: !this.state.nestedModal
        });
    }


    render() {


        let toolbar = [
            {name:'Create', icon:'fa-plus', onClick:this.toggle},
        ];


        return (
            <div>
                <DataGrid
                    store={this.state.store}
                    toolbars={toolbar}
                    pageShow={10}
                    fields={this.state.fields}
                    pagination={true}
                    title={"Deneme"}
                    onSelected={this.addNewRecord}
                />


                <Modal isOpen={this.state.modal2} toggle={this.toggle2} >
                    <ModalHeader toggle={this.toggle2}>ID</ModalHeader>
                        <ModalBody>
                            <h2>User Details</h2>
                            <p>Name:{this.state.store.props.data[this.state.selectedIndex].name}</p>
                            <p>Surname:{this.state.store.props.data[this.state.selectedIndex].surname}</p>
                            <p>T.C. Kimlik No:{this.state.store.props.data[this.state.selectedIndex].tckn}</p>
                            <br />

                            <Button color="success" onClick={this.toggleNested}>Edit User</Button>
                            <Button color="danger" onClick={this.deleteUser}>Delete User</Button>
                            <Modal isOpen={this.state.nestedModal} toggle={this.toggleNested}  backdrop={this.state.backdrop}>
                                <ModalHeader toggle={this.toggleNested}>Edit</ModalHeader>
                                    <ModalBody>
                                        <form onSubmit={this.editUser}>
                                            <Input type="text" id="name2"  name="name2" label="İsim" value={this.state.valueText}  onChange={this.handleChange}/>
                                            <Input type="text" id="surname2"  name="surname2" label="Soyisim" value={this.state.valueText}  onChange={this.handleChange}/>
                                            <Input type="number" name="tckn2" id="tckn2" label="T.C. Kimlik No" value={this.state.valueNumber} placeholder="Example Number Input" onChange={this.handleChange}/>
                                            <Button type="submit" value="Submit">Submit</Button>
                                        </form>
                                    </ModalBody>
                                <ModalFooter>
                                    <Button color="secondary" onClick={this.toggleNested}>Cancel</Button>
                                </ModalFooter>
                            </Modal>
                        </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.toggle2}>Do Something</Button>{' '}
                        <Button color="secondary" onClick={this.toggle2}>Cancel</Button>
                    </ModalFooter>
                </Modal>


                    <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className} backdrop={this.state.backdrop}>
                        <ModalHeader toggle={this.toggle}>Add</ModalHeader>
                        <ModalBody>
                            <form onSubmit={this.handleSubmit}>
                                <Input type="text" id="name"  name="name" label="İsim" value={this.state.valueText}  onChange={this.handleChange}/>
                                <Input type="text" id="surname"  name="surname" label="Soyisim" value={this.state.valueText}  onChange={this.handleChange}/>
                                <Input type="number" name="tckn" id="tckn" label="T.C. Kimlik No" value={this.state.valueNumber} placeholder="Example Number Input" onChange={this.handleChange}/>
                                <Button type="submit" value="Submit">Submit</Button>
                            </form>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                        </ModalFooter>
                    </Modal>




            </div>
        )
    }


}


export default App;
