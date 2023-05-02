var fs = require('fs');

var chrootHome = 'C:\Users\mouss\Desktop\Ftp-Project\Server\RootDirectory';

/**
 * Set the chroot jail base directory.
 * @param {!string} ch
 */
exports.setChrootHome = function (ch) {
      chrootHome = ch;
};


