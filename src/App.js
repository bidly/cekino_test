import * as React from "react";
import {Store, DataGrid, Input} from 'karcin-ui';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
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


            /*only 3 fields, Name, surname and tckn*/
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
                    {name:'Ahmet', surname:'Ali', tckn:'12345678910'},
                    {name:'Ayşe', surname:'Tok', tckn:'10987654321'},


                ]
            })
        };
        this.toggle = this.toggle.bind(this);
        this.toggle2 = this.toggle2.bind(this);
        this.toggleNested = this.toggleNested.bind(this);
        this.toggleAll = this.toggleAll.bind(this);
        this.selectedUser = this.selectedUser.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
        this.editUser = this.editUser.bind(this);

    }

    /* Toggle function for adding modal*/
    toggle() {
        this.setState({
            modal: !this.state.modal
        });
    }

    /* Modal for user info */
    selectedUser(event) {
        for (var i = 0; i<this.state.store.props.data.length; i++)
        {
            if(this.state.store.props.data[i].tckn === event[0].tckn)
            {
                this.setState({selectedIndex: i})
                break;
            }

        }
        this.toggle2()
    }

    /* Handle Change Function */
    handleChange(event) {
        console.log(event)
    }

    /* Handle Submit, used for adding user and checks duplicate records.*/
    handleSubmit(event) {
        event.preventDefault()
        console.log(event)

        /* Flag is for checking if the user is already on table.
        If it is, it will not add the record and warn the user*/
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

    /* Toggle for user info modal*/
    toggle2() {
        this.setState({
            modal2: !this.state.modal2
        });
    }

    /* Toggle for nested modal, which lets user to edit records*/
    toggleNested() {
        this.setState({
            nestedModal: !this.state.nestedModal,
            closeAll: false
        });
    }

    /* Closes all modals including nested ones*/
    toggleAll() {
        this.setState({
            nestedModal: !this.state.nestedModal,
            closeAll: true
        });
    }

    /* User delete function */
    deleteUser() {
        this.state.store.props.data.splice(this.state.selectedIndex, 1)
        this.toggle2()
        this.setState({selectedIndex: 0})
    }

    /* User Edit Function*/
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


        /* Add user button */
        let toolbar = [
            {name:'Create', icon:'fa-plus', onClick:this.toggle},
        ];


        return (
            <div>
                {/* Data Grid component from Karcin-ui*/}
                <DataGrid
                    store={this.state.store}
                    toolbars={toolbar}
                    pageShow={10}
                    fields={this.state.fields}
                    pagination={true}
                    title={"Mersis"}
                    onSelected={this.selectedUser}
                />


                {/* I used reactstrap for modals*
                /First modal is nested. User info model and nested modal for editing the user
                 */}
                <Modal isOpen={this.state.modal2} toggle={this.toggle2} >
                    <ModalHeader toggle={this.toggle2}>ID</ModalHeader>
                        <ModalBody>
                            <h2>User Details</h2>
                            <p>Name:{this.state.store.props.data[this.state.selectedIndex].name}</p>
                            <p>Surname:{this.state.store.props.data[this.state.selectedIndex].surname}</p>
                            <p>T.C. Kimlik No:{this.state.store.props.data[this.state.selectedIndex].tckn}</p>

                            {/* User info and edit and delete buttons afterwards */}
                            <Button color="success" onClick={this.toggleNested}>Edit User</Button>
                            <Button color="danger" onClick={this.deleteUser}>Delete User</Button>
                            <Modal isOpen={this.state.nestedModal} toggle={this.toggleNested}  backdrop={this.state.backdrop}>
                                <ModalHeader toggle={this.toggleNested}>Edit</ModalHeader>
                                    <ModalBody>
                                        <form onSubmit={this.editUser}>
                                            {/* Input form for editing user*/}
                                            <Input type="text" id="name2"  name="name2" label="İsim" value={this.state.valueText} onChange={this.handleChange}/>
                                            <Input type="text" id="surname2"  name="surname2" label="Soyisim" value={this.state.valueText} onChange={this.handleChange}/>
                                            <Input type="number" name="tckn2" id="tckn2" label="T.C. Kimlik No" value={this.state.valueNumber} onChange={this.handleChange}/>
                                            <Button type="submit" value="Submit">Submit</Button>
                                        </form>
                                    </ModalBody>
                                <ModalFooter>
                                    <Button color="secondary" onClick={this.toggleNested}>Cancel</Button>
                                </ModalFooter>
                            </Modal>
                        </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this.toggle2}>Cancel</Button>
                    </ModalFooter>
                </Modal>


                {/* This modal is for adding user*/}
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className} backdrop={this.state.backdrop}>
                    <ModalHeader toggle={this.toggle}>Add</ModalHeader>
                    <ModalBody>
                        <form onSubmit={this.handleSubmit}>
                            <Input type="text" id="name"  name="name" label="İsim" value={this.state.valueText}  onChange={this.handleChange}/>
                            <Input type="text" id="surname"  name="surname" label="Soyisim" value={this.state.valueText}  onChange={this.handleChange}/>
                            <Input type="number" name="tckn" id="tckn" label="T.C. Kimlik No" value={this.state.valueNumber} onChange={this.handleChange}/>
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
