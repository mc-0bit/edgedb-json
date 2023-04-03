module EDGEDB_JSON {
    abstract annotation JSON_TYPE;
}

module default {
    type User {
        property name -> str;
        property email -> str;
        required property tasks -> json {
            annotation EDGEDB_JSON::JSON_TYPE := 'default::Task[]';
            default := <json>[];
        }
    }

    abstract type Task {
        required property name -> str;
        property description -> str;
        property questions -> json {
            annotation EDGEDB_JSON::JSON_TYPE := 'default::Questions[]';
            default := <json>[];
        }
    }

    abstract type Questions {
        property name -> str;
        required property description -> str;
        required property question -> str;
        required property answer -> int16;
    }

    type test0 {
        required property hasasdda -> json {
            annotation EDGEDB_JSON::JSON_TYPE := 'testModule::hasasdda[]';
        }
    }
}

module testModule {
    type avc {
        required property name -> str;
        property description -> str;
        required property question -> str;
        property answer -> int16;
    }

    type hasasdda {
        required property users -> json {
            annotation EDGEDB_JSON::JSON_TYPE := 'default::User[]';
            default := <json>[];
        }
    }
}