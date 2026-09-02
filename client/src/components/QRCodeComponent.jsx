import React from 'react';
import QRCode from 'qrcode.react';

const QRCodeComponent = ({ url }) => {
    return url ? <QRCode value={url} size={128} level={"H"} renderAs={"canvas"} includeMargin={true} /> : null;
};

export default QRCodeComponent;