# multi-items-input

[![npm](https://img.shields.io/npm/v/multi-items-input.svg) ![npm](https://img.shields.io/npm/dm/multi-items-input.svg)](https://www.npmjs.com/package/multi-items-input)
[![vue2](https://img.shields.io/badge/vue-2.x-brightgreen.svg)](https://vuejs.org/)

You can select multiple items just with keyboard. Input some keywords and using ↓, ↑,*tab* or *enter* to select, *delete* to remove. 

[![header](https://jwolf.cn/uploads/1259098224027897856.gif)](https://www.npmjs.com/package/multi-items-input)

## Table of contents

- [Examples](#examples)
- [Installation](#installation)

# Examples

Project page

https://jwolfcn.github.io/vue-multi-items-input/


# Installation

```
npm install --save multi-items-input
```

## Usage

In your entry js,  *main.js*  mostly
```javascript
import Vue from 'vue'
import 'multi-items-input'
import 'multi-items-input/dist/multi-items-input.css'
```

Then you can use the tag  *multi-items-input*

```html
<multi-items-input
    :fetch="search"
    placeholder="placeholder"
    :height="100"
    separator=";"
    @select="select"
    @delete="onDelete"
    :selection-only="false"
></multi-items-input>
```
For more details, refer to the example directory.
## API

## Properties
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| v-model | Array |  | Binding value. Each object within it should be like `{name: 'xx', id: xx}` |
| placeholder | String |  | Place holder of input. |
| separator | String |  | Separator between items. |
| height | Number | 100 | Height of the container. |
| fetch | Function(queryStr, done) || Triggered to request for suggestion. Keywords would passed as the first parameter. The second parameter is a callback function which notifys the request is completed. |
|trigger-on-focus|Boolean| true| Whether trigger the  fetch function on focus.|
|selection-only|Boolean| false| Whether the user should select from the suggestion.|
|zIndexOfPopper|Number| -| Set the z-index of the popper.|
|disabled|Boolean| false| Set input editable|


## Events
| event | Parameters | description |
|-------|------|-------------|
| delete | Object, Array | The first parameter is the item which deleted. Second is the array of the selected items.  |
| select | Array, Object | The first parameter is the array of the selected items. Second is the item added.|

## License

MIT © [Jwolf](https://jwolf.cn)
