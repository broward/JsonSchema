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

        // abstract subclass of abstract class which adds location
        "nike-abstract": {
            "allOf": [
                { "$ref": "#/definitions/manufacturer-base" }, {
                    "properties": {
                        "location": {
                            "type": {
                                "enum": ["US", "CH", "FR", "EN"]
                            }
                        }
                    },
                    "required": ["location"]
                }
            ]
        },

        

        // extended subclass which adds channel
        "nike-extended": {
            "allOf": [
                { "$ref": "#/definitions/nike-abstract" }, {
                    "properties": {
                        "name": {
                            "type": {
                                "enum": ["nike-extended"]
                            }
                        },
                        "channel": {
                            "type": "array",
                            "minItems": 1,
                            "items": {
                                "type": {
                                    "enum": ["retail", "wholesale"]
                                },
                            },
                        },
                    },
                    "required": ["channel"]
                }
            ]
        },

        // This is the equivalent of Abstract Factory, enforces casting basically
        "manufacturer": {
            "oneOf": [
                { "$ref": "#/definitions/outdoor research" },
                { "$ref": "#/definitions/nike" },
                { "$ref": "#/definitions/nike-extended" }
            ]
        },

        // Retail class relates to a set of manufacturers
        "retailer": {
            "type": "object",
            "properties": {
                "name": { "type": "string" },
                "id": { "type": "string" },
                "manufacturers": {
                    "type": "array",
                    "minItems": 0,
                    "items": {
                        "type": {
                            "$ref": "#/definitions/manufacturer-base"
                        }
                    }
                }
            },
            "additionalProperties": false,
            "required": ["name", "id", "manufacturers"]
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
        "manufacturers": [{
            "name": "outdoor research",
            "id": "1",
            "description": "Outdoor Research #1",
            "channel": "business"
        }, {
            "name": "nike",
            "id": "2",
            "description": "Nike #1",
            "location": "US"
        }, {
            "name": "nike-extended",
            "id": "3",
            "description": "Nike Extended #1",
            "location": "US",
            "channel": ["retail"]
        }]
    }, {
        "name": "columbia",
        "id": "24",
        "manufacturers": [{
            "name": "outdoor research",
            "id": "1",
            "description": "Outdoor Research #2",
            "channel": "residential"
        }, {
            "name": "nike",
            "id": "2",
            "description": "Nike #2",
            "location": "FR"
        }]
    }, {
        "name": "amazon",
        "id": "25",
        "manufacturers": [{
            "name": "outdoor research",
            "id": "1",
            "description": "Outdoor Research #3",
            "channel": "residential"
        }, {
            "name": "nike",
            "id": "2",
            "description": "Nike #3",
            "location": "EN"
        }]
    }]
}

var error = v.validate(myData, mySchema);

if (error.errors.length == 0) {
    console.log("VALID SCHEMA!");
} else {
    console.log(error.errors);
}
