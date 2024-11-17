import path from 'path';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { ProtoGrpcType } from './generated/a';
import { AddressBookServiceHandlers } from './generated/AddressBookService';

const packageDefinition = protoLoader.loadSync(path.join(__dirname, '../src/a.proto'));

const personProto = grpc.loadPackageDefinition(packageDefinition) as unknown as ProtoGrpcType;

const PERSONS = [
    {
        name: "vishal",
        age: 22
    },
    {
        name: "raman",
        age: 22
    },
];

const handlers: AddressBookServiceHandlers = {
    AddPerson(call, callback) {

        let person = {
            name: call.request.name,
            age: call.request.age
        }
        PERSONS.push(person);
        callback(null, person)
    },

    GetPersonByName(call, callback) {

        const p1 = PERSONS.find(person => person.name === call.request.name);
        callback(null, p1)
    },

    DeleteUserByName(call, callback) {

    }
}



const server = new grpc.Server();

server.addService((personProto.AddressBookService).service, handlers);
server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
    server.start();
});