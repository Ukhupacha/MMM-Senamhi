# MMM-Senamhi
Module for the [MagicMirror²](https://github.com/MichMich/MagicMirror/) smart mirror.

Displays the weather according to [Senamhi](https://www.senamhi.gob.pe/?&p=estaciones)

### Example

![Example of MMM-Senamhi](images/example1.png?raw=true "Example screenshot")

## Installation
To install the module, use your terminal to:
1. Navigate to your MagicMirror's modules folder. If you are using the default installation directory, use the command:<br />`cd ~/MagicMirror/modules`
2. Clone the module:<br />`https://github.com/Ukhupacha/MMM-Senamhi.git`
3. Install: <br/>`npm install`


## Using the module

### MagicMirror² Configuration

To use this module, add the following configuration block to the modules array in the `config/config.js` file:
```js
var config = {
    modules: [
        ...
        {
            module: 'MMM-Senamhi',
            header: "Weather according to Senamhi",
            position: "top_left",
            config: {
                listID: "0019" // Location ID (Cusco by default)
            }
        },
        ...
    ]
}