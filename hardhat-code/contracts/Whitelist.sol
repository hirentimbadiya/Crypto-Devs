// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Whitelist {
    // * maximum number of addresses that can be whitelisted.
    uint8 public maxWhitelistedAddresses;

    // * number of addresses that are whitelisted.
    uint8 public numAddressesWhitelisted;

    // * map variable for each address whether it is whitelisted or not
    mapping(address => bool) public whitelistedAddresses;

    // * Intializing constructor for maximum numbers of address
    constructor(uint8 _maxWhitelistedAddresses) {
        maxWhitelistedAddresses = _maxWhitelistedAddresses;
    }

    function addAddressToWhitelist() public {
        // ! msg.sender is the address of the user who called this address.
        require(
            !whitelistedAddresses[msg.sender],
            "This Address is Already Whitelisted"
        );

        // ! check for max address.
        require(
            numAddressesWhitelisted < maxWhitelistedAddresses,
            "Maximum Limit Reached you cannot Whitelist your Address."
        );
        // * add address in the map and increament the number of Address Whitelisted
        whitelistedAddresses[msg.sender] = true;
        numAddressesWhitelisted += 1;
    }
}
