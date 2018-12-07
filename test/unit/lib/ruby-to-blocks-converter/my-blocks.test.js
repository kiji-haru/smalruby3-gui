import RubyToBlocksConverter from '../../../../src/lib/ruby-to-blocks-converter';
import {
    convertAndExpectToEqualBlocks,
    rubyToExpected,
    expectedInfo
} from '../../../helpers/expect-to-equal-blocks';

describe('RubyToBlocksConverter/My Blocks', () => {
    let converter;
    let target;

    beforeEach(() => {
        converter = new RubyToBlocksConverter(null);
        target = null;
    });

    test('procedures_definition,procedures_prototype', () => {
        const code = `
            def self.made_block(arg1, arg2)
              move(10)
            end
        `;
        const expected = [
            {
                opcode: 'procedures_definition',
                inputs: [
                    {
                        name: 'custom_block',
                        block: {
                            opcode: 'procedures_prototype',
                            mutation: {
                                proccode: 'made_block %s %s',
                                arguments: [
                                    {
                                        name: 'arg1',
                                        type: 'string_number'
                                    },
                                    {
                                        name: 'arg2',
                                        type: 'string_number'
                                    }
                                ]
                            },
                            shadow: true
                        }
                    }
                ],
                next: {
                    opcode: 'motion_movesteps',
                    inputs: [
                        {
                            name: 'STEPS',
                            block: expectedInfo.makeNumber(10)
                        }
                    ]
                }
            }
        ];
        convertAndExpectToEqualBlocks(converter, target, code, expected);
    });

    test('argument_reporter_string_number', () => {
        const code = `
            def self.made_block(arg1, arg2)
              move(arg1)
            end
        `;
        const expected = [
            {
                opcode: 'procedures_definition',
                inputs: [
                    {
                        name: 'custom_block',
                        block: {
                            opcode: 'procedures_prototype',
                            mutation: {
                                proccode: 'made_block %s %s',
                                arguments: [
                                    {
                                        name: 'arg1',
                                        type: 'string_number'
                                    },
                                    {
                                        name: 'arg2',
                                        type: 'string_number'
                                    }
                                ]
                            },
                            shadow: true
                        }
                    }
                ],
                next: {
                    opcode: 'motion_movesteps',
                    inputs: [
                        {
                            name: 'STEPS',
                            block: {
                                opcode: 'argument_reporter_string_number',
                                fields: [
                                    {
                                        name: 'VALUE',
                                        value: 'arg1'
                                    }
                                ]
                            },
                            shadow: expectedInfo.makeNumber(10)
                        }
                    ]
                }
            }
        ];
        convertAndExpectToEqualBlocks(converter, target, code, expected);
    });

    test('argument_reporter_boolean,argument_reporter_string_number', () => {
        const code = `
            def self.made_block(arg1, arg2)
              move(arg1)
              if arg2
                bounce_if_on_edge
              end
            end
        `;
        const expected = [
            {
                opcode: 'procedures_definition',
                inputs: [
                    {
                        name: 'custom_block',
                        block: {
                            opcode: 'procedures_prototype',
                            mutation: {
                                proccode: 'made_block %s %b',
                                arguments: [
                                    {
                                        name: 'arg1',
                                        type: 'string_number'
                                    },
                                    {
                                        name: 'arg2',
                                        type: 'boolean'
                                    }
                                ]
                            },
                            shadow: true
                        }
                    }
                ],
                next: {
                    opcode: 'motion_movesteps',
                    inputs: [
                        {
                            name: 'STEPS',
                            block: {
                                opcode: 'argument_reporter_string_number',
                                fields: [
                                    {
                                        name: 'VALUE',
                                        value: 'arg1'
                                    }
                                ]
                            },
                            shadow: expectedInfo.makeNumber(10)
                        }
                    ],
                    next: {
                        opcode: 'control_if',
                        inputs: [
                            {
                                name: 'CONDITION',
                                block: {
                                    opcode: 'argument_reporter_boolean',
                                    fields: [
                                        {
                                            name: 'VALUE',
                                            value: 'arg2'
                                        }
                                    ]
                                }
                            }
                        ],
                        branches: [
                            rubyToExpected(converter, target, 'bounce_if_on_edge')[0]
                        ]
                    }
                }
            }
        ];
        convertAndExpectToEqualBlocks(converter, target, code, expected);
    });

    test('argument_reporter_boolean,argument_reporter_string_number 2', () => {
        const code = `
            def self.made_block(arg1)
              move(arg1)
              if arg1
              end
            end
        `;
        const expected = [
            {
                opcode: 'procedures_definition',
                inputs: [
                    {
                        name: 'custom_block',
                        block: {
                            opcode: 'procedures_prototype',
                            mutation: {
                                proccode: 'made_block %b',
                                arguments: [
                                    {
                                        name: 'arg1',
                                        type: 'boolean'
                                    }
                                ]
                            },
                            shadow: true
                        }
                    }
                ],
                next: {
                    opcode: 'motion_movesteps',
                    inputs: [
                        {
                            name: 'STEPS',
                            block: {
                                opcode: 'argument_reporter_boolean',
                                fields: [
                                    {
                                        name: 'VALUE',
                                        value: 'arg1'
                                    }
                                ]
                            },
                            shadow: expectedInfo.makeNumber(10)
                        }
                    ],
                    next: {
                        opcode: 'control_if',
                        inputs: [
                            {
                                name: 'CONDITION',
                                block: {
                                    opcode: 'argument_reporter_boolean',
                                    fields: [
                                        {
                                            name: 'VALUE',
                                            value: 'arg1'
                                        }
                                    ]
                                }
                            }
                        ],
                        branches: []
                    }
                }
            }
        ];
        convertAndExpectToEqualBlocks(converter, target, code, expected);
    });

    test('argument_reporter_boolean,argument_reporter_string_number 3', () => {
        const code = `
            def self.made_block(arg1)
              move(arg1)
            end

            def self.made_block2(arg1)
              move(arg1)
              if arg1
              end
            end
        `;
        const expected = [
            {
                opcode: 'procedures_definition',
                inputs: [
                    {
                        name: 'custom_block',
                        block: {
                            opcode: 'procedures_prototype',
                            mutation: {
                                proccode: 'made_block %s',
                                arguments: [
                                    {
                                        name: 'arg1',
                                        type: 'string_number'
                                    }
                                ]
                            },
                            shadow: true
                        }
                    }
                ],
                next: {
                    opcode: 'motion_movesteps',
                    inputs: [
                        {
                            name: 'STEPS',
                            block: {
                                opcode: 'argument_reporter_string_number',
                                fields: [
                                    {
                                        name: 'VALUE',
                                        value: 'arg1'
                                    }
                                ]
                            },
                            shadow: expectedInfo.makeNumber(10)
                        }
                    ]
                }
            },
            {
                opcode: 'procedures_definition',
                inputs: [
                    {
                        name: 'custom_block',
                        block: {
                            opcode: 'procedures_prototype',
                            mutation: {
                                proccode: 'made_block2 %b',
                                arguments: [
                                    {
                                        name: 'arg1',
                                        type: 'boolean'
                                    }
                                ]
                            },
                            shadow: true
                        }
                    }
                ],
                next: {
                    opcode: 'motion_movesteps',
                    inputs: [
                        {
                            name: 'STEPS',
                            block: {
                                opcode: 'argument_reporter_boolean',
                                fields: [
                                    {
                                        name: 'VALUE',
                                        value: 'arg1'
                                    }
                                ]
                            },
                            shadow: expectedInfo.makeNumber(10)
                        }
                    ],
                    next: {
                        opcode: 'control_if',
                        inputs: [
                            {
                                name: 'CONDITION',
                                block: {
                                    opcode: 'argument_reporter_boolean',
                                    fields: [
                                        {
                                            name: 'VALUE',
                                            value: 'arg1'
                                        }
                                    ]
                                }
                            }
                        ],
                        branches: []
                    }
                }
            }
        ];
        convertAndExpectToEqualBlocks(converter, target, code, expected);
    });

    test('procedures_call', () => {
        const code = `
            def self.made_block(arg1, arg2)
              move(arg1)
              if arg2
                bounce_if_on_edge
              end
            end

            made_block(12, touching?("_edge_"))
        `;
        const expected = [
            {
                opcode: 'procedures_definition',
                inputs: [
                    {
                        name: 'custom_block',
                        block: {
                            opcode: 'procedures_prototype',
                            mutation: {
                                proccode: 'made_block %s %b',
                                arguments: [
                                    {
                                        name: 'arg1',
                                        type: 'string_number'
                                    },
                                    {
                                        name: 'arg2',
                                        type: 'boolean'
                                    }
                                ]
                            },
                            shadow: true
                        }
                    }
                ],
                next: {
                    opcode: 'motion_movesteps',
                    inputs: [
                        {
                            name: 'STEPS',
                            block: {
                                opcode: 'argument_reporter_string_number',
                                fields: [
                                    {
                                        name: 'VALUE',
                                        value: 'arg1'
                                    }
                                ]
                            },
                            shadow: expectedInfo.makeNumber(10)
                        }
                    ],
                    next: {
                        opcode: 'control_if',
                        inputs: [
                            {
                                name: 'CONDITION',
                                block: {
                                    opcode: 'argument_reporter_boolean',
                                    fields: [
                                        {
                                            name: 'VALUE',
                                            value: 'arg2'
                                        }
                                    ]
                                }
                            }
                        ],
                        branches: [
                            rubyToExpected(converter, target, 'bounce_if_on_edge')[0]
                        ]
                    }
                }
            },
            {
                opcode: 'procedures_call',
                mutation: {
                    proccode: 'made_block %s %b',
                    argument_blocks: [
                        expectedInfo.makeText('12'),
                        rubyToExpected(converter, target, 'touching?("_edge_")')[0]
                    ]
                }
            }
        ];
        convertAndExpectToEqualBlocks(converter, target, code, expected);
    });

    test('procedures_call 2', () => {
        const code = `
            def self.made_block(arg1)
            end

            made_block(12)
        `;
        const expected = [
            {
                opcode: 'procedures_definition',
                inputs: [
                    {
                        name: 'custom_block',
                        block: {
                            opcode: 'procedures_prototype',
                            mutation: {
                                proccode: 'made_block %s',
                                arguments: [
                                    {
                                        name: 'arg1',
                                        type: 'string_number'
                                    }
                                ]
                            },
                            shadow: true
                        }
                    }
                ]
            },
            {
                opcode: 'procedures_call',
                mutation: {
                    proccode: 'made_block %s',
                    argument_blocks: [
                        expectedInfo.makeText('12')
                    ]
                }
            }
        ];
        convertAndExpectToEqualBlocks(converter, target, code, expected);
    });
});
