var Validator = require('jsonschema').Validator;
var v = new Validator();

var mySchema = {
    "$schema": "http://json-schema.org/draft-04/schema#",

    "definitions": {

        // Equivalent of abstract base class definition
        "manufacturer-base": {
            "type": "object",
            "properties": {
                "name": { "type": "string" },
                "id": { "type": "string" },
                "description": { "type": "string" },
            },
            "required": ["name", "id", "description"]
        },

        // Subclass which adds a channel property
        "outdoor research": {
            "allOf": [
                { "$ref": "#/definitions/manufacturer-base" }, {
                    "properties": {
                        "name": {
                            "type": {
                                "enum": ["outdoor research"]
                            }
                        },
                        "channel": { "enum": ["residential", "business"] }
                    },
                    "required": ["channel"]
                }
            ]
        },

        // Subclass which adds a location array 
        "nike": {
            "allOf": [
                { "$ref": "#/definitions/manufacturer-base" }, {
                    "properties": {
                        "name": {
                            "type": {
                                "enum": ["nike"]
                            }
                        },
                        "locations": {
                            "type": "array",
                            "minItems": 1,
                            "items": {
                                "type": {
                                    "enum": ["USA", "England", "Brazil"]
                                },
                            },
                        },
                    },
                    "required": ["locations"]
                }
            ]
        },

        // Subclass of abstract class
        "the north face": {
            "allOf": [
                { "$ref": "#/definitions/manufacturer-base" }, {
                    "properties": {
                        "name": {
                            "type": {
                                "enum": ["the north face"]
                            }
                        }
                    }
                }
            ]
        },

        // This is the equivalent of Abstract Factory, enforces casting basically
        "manufacturer": {
            "oneOf": [
                { "$ref": "#/definitions/outdoor research" },
                { "$ref": "#/definitions/nike" },
                { "$ref": "#/definitions/the north face" }
            ]
        },

        // Retail class relates to a set of manufacturers
        "retailer": {
            "type": "object",
            "properties": {
                "name": { "type": "string" },
                "id": { "type": "string" },
                "manufacturer-bases": {
                    "type": "array",
                    "minItems": 0,
                    "items": {
                        "type": {
                            "$ref": "#/definitions/manufacturer"
                        }
                    }
                }
            },
            "additionalProperties": false,
            "required": ["name", "id", "manufacturer-bases"]
        }
    },

    // Object instantiation equivalent
    "type": "object",
    "properties": {
        "retailers": {
            "type": "array",
            "minItems": 0,
            "items": {
                "type": {
                    "$ref": "#/definitions/retailer"
                }
            }
        }
    }
}

var myData = {
    "retailers": [{
        "name": "rei",
        "id": "23",
        "manufacturer-bases": [{
            "name": "outdoor research",
            "id": "1",
            "description": "Outdoor Research #1",
            "channel": "business"
        }, {
            "name": "nike",
            "id": "2",
            "description": "Nike #1",
            "locations": ["Brazil"]
        }, {
            "name": "the north face",
            "id": "3",
            "description": "North Face #1"
        }]
    }, {
        "name": "columbia",
        "id": "24",
        "manufacturer-bases": [{
            "name": "outdoor research",
            "id": "1",
            "description": "Outdoor Research #2",
            "channel": "residential"
        }, {
            "name": "the north face",
            "id": "3",
            "description": "North Face #2"
        }]
    }, {
        "name": "amazon",
        "id": "25",
        "manufacturer-bases": [{
            "name": "outdoor research",
            "id": "1",
            "description": "Outdoor Research #3",
            "channel": "residential"
        }, {
            "name": "nike",
            "id": "2",
            "description": "Nike #2",
            "locations": ["USA", "England"]
        }]
    }]
}

var error = v.validate(myData, mySchema);

if (error.errors.length == 0) {
    console.log("VALID SCHEMA!");
} else {
    console.log(error.errors);
}
