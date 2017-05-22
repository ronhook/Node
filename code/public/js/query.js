
'use strict';

class Query {
    constructor (sel = false, parent = false) {
        // Based on the jQuery regular expression to test if a string is html
        this.regHTML    = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/;
        this.length     = 0;
        let that        = this;
        this.nodes      = new Proxy([], {
            get: function(tgt, prop) {
                return tgt[prop];
            },
            set: function(tgt, prop, val) {
                tgt[prop] = val;
                that.length = tgt.length;
                return true;
            }
        });
        if (sel) {
            this.select(sel, parent);
        }
    }
    /*
     * Gets a list of Dom objects
     * @param {String} sel
     * @param {String} parent
     * @returns {self}
     */
    select (sel, parent = false) {
       this._setNodes(this._select(sel, parent));
       return this;
    }
    /*
     * Adds nodes to the node list
     * @param {String} sel
     * @returns {Query}
     */
    add (sel) {
        let nodes = [];
        switch(this._type(sel)){
            case "string":
                nodes = this._select(sel);
                break;
            case "node":
                nodes = [sel];
                break;
            case "Query":
                sel.each(function(node){
                    nodes.push(node);
                },true);
                break;
        }
        this._setNodes(this.nodes.concat(nodes));
        return this;
    }
    /*
     * Gets a list of Dom objects
     * @param {String} sel
     * @param {Node} parent
     * @returns {Array}
     */
    _select (sel, parent = false) {
        let nodes = [];
        //console.log('type:', this._type(sel));
        switch(this._type(sel)){
            case "string":
                parent = parent || document;
                if(parent.nodeType != 1){
                    parent = document;
                }
                let found = parent.querySelectorAll(sel);
                for (let i=0; i<found.length; i++) {
                    if (found[i].nodeType == 1) {
                        nodes.push(found[i]);
                    }
                }
                break;
            case "node":
                nodes.push(sel);
                break;
            case "Query":
                sel.each(function(node){
                    nodes.push(node);
                },true);
                break;
        }
        return nodes;
    }
    /*
     * Determines the type of element
     * @param {type} elem
     * @returns {String|Boolean}
     */
    _type (elem) {
        switch(typeof(elem)){
            case "string":
                // test if the string is a selector or html format
                let match = elem = this.regHTML.exec(elem);
                if(match){
                    return "stringHTML"
                }else{
                    return "string";
                }
                break;
            case "object":
                if(elem.nodeType == 1){
                    return "node";
                }else if(elem instanceof Query){
                    return "Query";
                } else {
                    return Object.prototype.toString.call(elem).replace(/^\[object (.+)\]$/, "$1").toLowerCase();
                }
                break;
        }
        return false;
    }
    /*
     * Adds html before each node
     * @param {String|NOde|Query} html
     * @returns {Query}
     */
    before (html) {
        this._attach(html, 'beforebegin');
        return this;
    }
    /*
     * Adds html after each node
     * @param {String|NOde|Query} html
     * @returns {Query}
     */
    after (html) {
        this._attach(html, 'afterend');
        return this;
    }
    /*
     * Adds html to yhe start of each node
     * @param {String|NOde|Query} html
     * @returns {Query}
     */
    start (html) {
        this._attach(html, 'afterbegin');
        return this;
    }
    /*
     * Adds html to the end of each node
     * @param {String|NOde|Query} html
     * @returns {Query}
     */
    end (html) {
        this._attach(html, 'beforeend');
        return this;
    }
    /*
     * Adds html before or after each node
     * @param {String|NOde|Query} html
     * @param {String} before
     * @returns {undefined}
     */
    _attach (html, before) {
        html = this._htmlString(html);
        this.nodes.forEach(function(node){
            node.insertAdjacentHTML(before, html);
        }, this);
        // execute scripts
        this._execScripts(html);
    }
    /*
     * Parses html into nodes
     * @param {String} html
     * @returns {Array}
     */
    _getNodesFromString (html) {
        let nodes       = [];
        let parsedNodes = new DOMParser().parseFromString(html, "text/html").querySelectorAll("body")[0].childNodes;
        for (let i=0; i<parsedNodes.length; i++) {
            if (parsedNodes[i].nodeType == 1) {
                nodes.push(parsedNodes[i]);
            }
        }
        return nodes;
    }
    /*
     * Removes all nodes from the object
     * @returns {Query}
     */
    empty () {
        this.nodes.forEach(function(node){
            node.innerHTML = "";
        });
        return this;
    }
    /*
     * Adds html to an object
     * @param {String|NOde|Query} html
     * @returns {Query}
     */
    html (html = false) {
        let val = undefined;
        if (html) {
            html = this._htmlString(html);
        }
        this.nodes.forEach(function(node){
            if (html) {
                node.innerHTML = html;
            } else if (val == undefined) {
                val = node.innerHTML;
            }
        });
        if (html) {
            this._execScripts(html);
        }
        return html ? this : (val === undefined ? "" : val);
    }
    /**
     * Sets/Gets text of a node
     * @param {type} text
     * @returns {val|Query|String}
     */
    text (text = false) {
        let val = undefined;
        this.nodes.forEach(function(node){
            if (text) {
                node.textContent = text;
            } else if (val == undefined) {
                val = node.textContent;
            }
        });
        return text ? this : (val === undefined ? "" : val);
    }
    /**
     * Turns a node or Query object node list to html
     * @param {String|NOde|Query} html
     * @returns {String}
     */
    _htmlString(html) {
        switch(this._type(html)) {
            case "node":
                html = html.outerHTML;
                break;
            case "Query":
                let temp = "";
                html.each(function(node){
                    temp += node.outerHTML;
                }, true);
                html = temp;
                break;
        }
        return html;
    }
    /*
     * Gets/Sets a dom attribute
     * @param {String} attr
     * @param {String} val
     * @returns {Query}
     */
    prop (attr, val = false) {
        let prop = undefined;
        this.nodes.forEach(function(node){
            if(val !== false){
                node.setAttribute(attr, val);
            }else{
                if (prop == undefined) {
                    prop = node.getAttribute(attr);
                }
            }
        });
        return val ? this : (prop === undefined ? "" : prop);
    }
    /*
     * Applies a function to each node
     * @param {Function} func
     * @pamam (Boolean} domNode
     * @returns {Query}
     */
    each (func, domNode = false) {
        this.nodes.forEach(function(node, index) {
            func.apply(this, [domNode ? node  : new Query(node), index]);
        }.bind(this));
        return this;
    }
    /*
     * Executes a function
     * @param {Function} func
     * @param {Array} params
     * @returns {Query}
     */
    once (func, ...params) {
        func.apply(this, params);
        return this;
    }
    /*
     * Adds an event to a node
     * @param {String} event
     * @param {Function} func
     * @param {Boolean} allowBubble
     * @returns {Query}
     */
    on (event, func, allowBubble = false) {
        this.nodes.forEach(function(node){
            node.addEventListener(event, func);
        }.bind(this));
        return this;
    }
    /*
     * Triggers an event on the nodes
     * @param {String} event
     * @returns {Query}
     */
    trigger (event) {
        this.nodes.forEach(function(node){
            let ev = new Event(event);
            node.dispatchEvent(ev);
        });
        return this;
    }
    /*
     * Removes a named event
     * @param {String} event
     * @param {Function} func
     * @returns {Query}
     */
    off (event, func) {
        this.nodes.forEach(function(node){
            node.removeEventListener(event, func);
        });
        return this;
    }
    /*
     * Adds/Removes a class
     * @param {String} className
     * @returns {Query}
     */
    toggle (className) {
        this.nodes.forEach(function(node) {
            node.classList.toggle(className);
        });
        return this;
    }
    /*
     * Adds a class
     * @param {String} className
     * @returns {Query}
     */
    addClass (className) {
        this._class(className);
        return this;
    }
    /*
     * Removes a class
     * @param {String} className
     * @returns {Query}
     */
    removeClass (className) {
        this._class(className, true);
        return this;
    }
    /*
     * Add or removes a class
     * @param {String} className
     * @param {String} remove
     * @returns {undefined}
     */
    _class (className, remove = false) {
        this.nodes.forEach(function(node) {
            if (remove) {
                node.classList.remove(className);
            } else {
                node.classList.add(className);
            }
        });
    }
    /*
     * Gets/Sets a css value
     * @param {String|Object} styles
     * @param {String} value
     * @returns {Query|String}
     */
    css (styles, value = false){
        let response = value ? this : [];
        this.nodes.forEach(function(node) {
            switch(this._type(styles)){
                case "string":
                    if(!value){
                        response.push(getComputedStyle(node)[styles]);
                    }else{
                        node.style[styles] = value;
                    }
                    break;

                case "object":
                    for(let index in styles){
                        node.style[index] = styles[index];
                    }
                    break;
            }
        }.bind(this));
        return value ? response : (this.nodes.length > 1 ? response : response.join());
    }
    /*
     * Finds children of the current nodes
     * @param {String} sel
     * @returns {Query}
     */
    find (sel) {
        let newNodes = [];
        this.nodes.forEach(function(node){
            let obj = node.querySelectorAll(sel);
            for(let index in obj){
                if(obj[index].nodeType == 1) {
                    newNodes.push(obj[index]);
                }
            }
        }, this);
        this.nodes = newNodes;
        return this;
    }
    /*
     * Gets the parent nodes
     * @param {type} sel
     * @returns {Query}
     */
    parent (sel = false) {
        let newNodes = [];
        this.nodes.forEach(function(node){
            let parent = false;
            if (sel && node.closest) {
                parent = node.closest(sel);
            } else {
                parent = node.parentNode;
                while (parent && (parent.nodeType != 1 || (sel ? !this._matches(parent, sel) : false))) {
                    parent = parent.parentNode;
                }
                if (sel && !this._matches(parent, sel)) {
                    parent = false;
                }
            }
            if(parent && parent.nodeType == 1){
                newNodes.push(parent);
            }
        }, this);
        this._setNodes(newNodes);
        return this;
    }
    /*
     * Checks if at least one of the nodes matches the selector
     * @param {String|NOde|Query} sel
     * @returns {Query.is@call;_matches|Boolean}
     */
    is (sel) {
        let matched = false, selType = this._type(sel);
        this.nodes.forEach(function(node){
            if (!matched) {
                switch(selType){
                    case "string":
                        matched = this._matches(node, sel);
                        break;
                    case "node":
                        matched = node == sel;
                        break;
                    case "Query":
                        sel.each(function(sel_node){
                            if (!matched) {
                                matched = node == sel_node;
                            }
                        },true);
                        break;
                }
            }
        },this);
        return matched;
    }
    /*
     * Tests if an objects matches the selector
     * @param {Node} node
     * @param {String} sel
     * @returns {Boolean}
     */
    _matches (node, sel) {
        if (Element.prototype.matches) {
            return node.matches(sel);
        }
        if (!node) {
            return false;
        }
        let nodes = (node.parentNode || node.document).querySelectorAll(sel), i = -1;
        while (nodes[++i] && nodes[i] != node);
        return !!nodes[i];
    }
    /*
     * replaces the current nodes with a new set
     * @param {Array} nodes
     * @returns {undefined}
     */
    _setNodes (nodes) {
        this.nodes.length = 0;
        nodes.forEach(function(node){
            // must be a unique set of nodes
            if (!this.nodes.includes(node)) {
                this.nodes.push(node);
            }
        }, this);
    }
    /*
     * Removes the nodes
     * @returns {Query}
     */
    remove () {
        this.nodes.forEach(function(node){
            node.remove();
        }, this);
        this._setNodes([]);
        return this;
    }
    /*
     * Executes scripts in the hrml
     * @param {String} html
     * @returns {undefined}
     */
    _execScripts (html) {
        let nodeList = [];
        switch(this._type(html)){
            case "stringHTML":
            case "string":
                nodeList = this._getNodesFromString(html);
                break;
        }
        nodeList.forEach(function(node){
            this._doScript(this._findScripts(node));
        }, this);
    }
    /*
     * Gets all the code for script tags
     * @param {Node} node
     * @returns {Array}
     */
    _findScripts (node){
        let scripts = [];
        if(this._type(node) == "node"){
            if(node.localName  == "script"){
                scripts.push(node.textContent);
            }else{
                let found = new Query("script", node);
                found.each(function(node){
                    scripts.push(node.textContent);
                }, true);
            }
        }
        return scripts;
    }
    /*
     * Executes an array of javascript code
     * @param {Array} sciptList
     * @returns {undefined}
     */
    _doScript (sciptList) {
        sciptList.forEach(function(code){
            let script  = document.createElement("script");
            let head    = document.getElementsByTagName("head")[0];
            script.appendChild(document.createTextNode(code));
            head.insertBefore(script, head.firstChild);
            head.removeChild(script);
        });
    }
   /*
    * Get the immediate next sibling or the next sibling that matches the selector
    * @param {String|Boolean} sel
    * @returns {Query}
    */
    next (sel = false) {
        this._sibling(true, sel);
        return this;
    }
    /*
     * Get the immediate previous sibling or the previous that matches the selector
     * @param {String|Boolean} sel
     * @returns {Query}
     */
    prev (sel = false) {
        this._sibling(false, sel);
        return this;
    }
    /*
     * Get the immediate previous or next sibling or the one that matches the selector
     * @param {Boolean} next
     * @param {String|Boolean} sel
     * @returns {undefined}
     */
    _sibling(next, sel) {
        let newNodes = [];
        this.nodes.forEach(function(node){
            let sibling = next ? node.nextElementSibling : node.previousElementSibling;
            while (sibling && (sibling.nodeType != 1 || (sel ? !this._matches(sibling, sel) : true))) {
                sibling = next ? sibling.nextElementSibling : sibling.previousElementSibling;
            }
            if(sibling && sibling.nodeType == 1){
                newNodes.push(sibling);
            }
        }, this);
        this._setNodes(newNodes);
    }
    /*
    * Checks if at least one of the nodes contains the selector
    * @param {String} sel
    * @returns {Boolean}
    */
    has(sel) {
        let found = false
        this.nodes.forEach(function(node){
            if (!found) {
                found = node.querySelectorAll(sel).length > 0;
            }
        }, this);
        return found;
    }
    /*
    * Reduces the nodes by testing with a function
    * @param {Function} test
    * @returns {Query}
    */
    filter(test) {
        // Create a set of Query objects for each node
        let nodes = [];
        this.nodes.forEach(function(node){
            nodes.push(new Query(node));
        });
        // Filter the nodes
        let filtered = nodes.filter(test);
        // Return the list back to node objects
        let newNodes = [];
        filtered.forEach(function(node){
            newNodes.push(node);
        });
        // Update the nodes list
        this._setNodes(newNodes);
        return this
    }
};

