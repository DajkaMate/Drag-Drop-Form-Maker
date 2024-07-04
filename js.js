document.addEventListener('DOMContentLoaded', () => {
    const planner = document.getElementById('planner');
    const propertyDetails = document.getElementById('property-details');
    const sidebar = document.getElementById('sidebar');
    let draggedElement = null;
    let isNewElement = false;

    const DefinedComponents = [
        {
            name: 'Heading',
            displayText: 'Heading',
            create: () => {
                const heading = document.createElement('h2');
                heading.innerText = 'Heading Text';
                return heading;
            },
            properties: [
                {
                    label: 'Text',
                    value: 'Heading Text',
                    type: 'text'
                },
                {
                    label: 'Color',
                    value: '#000000',
                    type: 'color'
                },
                {
                    label: 'Font Size',
                    value: '16px',
                    type: 'select',
                    options: ['12px', '16px', '20px', '24px', '32px'] // Include options here
                },
                {
                    label: 'Bold',
                    value: 'false',
                    type: 'checkbox',

                },
                {
                    label: 'Id',
                    value: '',
                    type: 'text',
                },
                {
                    label: 'Class',
                    value: '',
                    type: 'text',
                }
            ]
        },
        {
            name: 'Paragraph',
            displayText: 'Paragraph',
            create: () => {
                const paragraph = document.createElement('p');
                paragraph.innerText = 'Paragraph Text';
                return paragraph;
            },
            properties: [
                {
                    label: 'Textarea',
                    value: 'Paragraph Text',
                    type: 'text'
                },
                {
                    label: 'Color',
                    value: '#000000',
                    type: 'color'
                },
                {
                    label: 'Font Size',
                    value: '16px',
                    type: 'select',
                    options: ['12px', '16px', '20px', '24px', '32px'] // Include options here
                },
                {
                    label: 'Bold',
                    value: 'false',
                    type: 'checkbox',

                },
                {
                    label: 'Id',
                    value: '',
                    type: 'text',
                },
                {
                    label: 'Class',
                    value: '',
                    type: 'text',
                }
            ]
        },
        {
            name: 'Input',
            displayText: 'Input',
            create: () => {
                const formInputDiv = document.createElement('div');
                formInputDiv.classList.add('form-input');

                // Create the label for the input
                const inputLabel = document.createElement('label');
                inputLabel.setAttribute('for', 'input-' + Date.now()); // Unique identifier for the input
                inputLabel.innerText = 'Input Label'; // Default label text
                formInputDiv.appendChild(inputLabel);

                // Create the input element
                const input = document.createElement('input');
                input.setAttribute('type', 'text');
                input.setAttribute('placeholder', 'Input Placeholder');
                input.disabled = false; // Default enabled
                input.id = 'input-' + Date.now(); // Unique identifier for the input
                formInputDiv.appendChild(input);
                return formInputDiv;
            },
            properties: [
                {
                    label: 'Label',
                    value: 'Input Label',
                    type: 'text'
                },
                {
                    label: 'Disabled',
                    value: 'enabled',
                    type: 'checkbox'
                }
            ]
        },
        {
            name: 'Link',
            displayText: 'Link',
            create: () => {
                const link = document.createElement('a');
                link.setAttribute('href', '#');
                link.innerText = 'Link Text';
                return link;
            },
            properties: [
                {
                    label: 'Text',
                    value: 'Link Text',
                    type: 'text'
                },
                {
                    label: 'URL',
                    value: '#',
                    type: 'text'
                },
                {
                    label: 'Color',
                    value: '#000000',
                    type: 'color'
                },
                {
                    label: 'Id',
                    value: '',
                    type: 'text',
                },
            ]
        },
        {
            name: 'Image',
            displayText: 'Image',
            create: () => {
                const imageWrapper = document.createElement('div');
                imageWrapper.classList.add('image-wrapper');
                imageWrapper.style.display = 'flex';
                imageWrapper.style.alignItems = 'center';
                imageWrapper.style.justifyContent = 'center';
                imageWrapper.style.position = 'relative';

                const image = document.createElement('img');
                image.style.display = 'none';
                image.style.maxWidth = '350';
                image.style.maxHeight = '250';
                image.draggable = false;


                const fileInput = document.createElement('input');
                fileInput.setAttribute('type', 'file');
                fileInput.setAttribute('accept', 'image/*');
                fileInput.style.display = 'none';

                fileInput.addEventListener('change', (event) => {
                    const file = event.target.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            image.src = e.target.result;
                            image.style.display = 'block';

                            // Automatically rescale the image to match the source
                            image.onload = () => {
                                const maxWidth = 350;
                                const ratio = image.naturalWidth > maxWidth ? maxWidth / image.naturalWidth : 1;
                                const newWidth = image.naturalWidth * ratio;
                                const newHeight = image.naturalHeight * ratio;
                                imageWrapper.style.width = newWidth + 'px';
                                imageWrapper.style.height = newHeight + 'px';
                            };
                        };
                        reader.readAsDataURL(file);
                    }
                });

                imageWrapper.appendChild(image);
                imageWrapper.appendChild(fileInput);

                return imageWrapper;
            },
            properties: [
                {
                    label: 'Width',
                    value: '350',
                    type: 'text'
                },
                {
                    label: 'Height',
                    value: '200',
                    type: 'text'
                },
            ]
        }

    ];

    function attachEventListeners(component) {
        component.addEventListener('dragstart', handleDragStart);
        component.addEventListener('dragend', handleDragEnd);
        component.addEventListener('dragover', handleDragOver); // New event listener for dragover
        component.addEventListener('dragenter', handleDragEnter); // New event listener for dragenter
        component.addEventListener('dragleave', handleDragLeave); // New event listener for dragleave
        component.addEventListener('click', handleComponentClick);
    }

    function handleDragStart(e) {
        draggedElement = e.target;
        isNewElement = !planner.contains(draggedElement);
        setTimeout(() => {
            e.target.classList.add('dragging');
        }, 0);
    }

    function handleDragEnd(e) {
        if (draggedElement) {

            draggedElement.classList.remove('dragging');
            draggedElement = null;
    
            // Remove dragging-over class from all components on drag end
            const components = document.querySelectorAll('.component');
            components.forEach(component => {
                component.classList.remove('dragging-over');
                component.classList.remove('shifting-down');
            });
        }
    }

    function handleDragOver(e) {
        e.preventDefault();
    }

    function handleDragEnter(e) {
        e.preventDefault();
        if (draggedElement && e.target !== draggedElement) {
            const planner = document.getElementById('planner');
            const draggingOverElement = e.target.closest('.component');
            
            if (draggingOverElement && planner.contains(draggingOverElement)) {
                // Add dragging-over class to the element being dragged over
                draggingOverElement.classList.add('dragging-over');
                
                // Remove dragging-over class from all other components in the planner
                const componentsInPlanner = planner.querySelectorAll('.component');
                componentsInPlanner.forEach(component => {
                    if (component !== draggingOverElement) {
                        component.classList.remove('dragging-over');
                    }
                });
                
                // Add shifting-down class to components below the dragging-over element
                let foundDragOver = false;
                componentsInPlanner.forEach(component => {
                    if (foundDragOver && component !== draggingOverElement) {
                        component.classList.add('shifting-down');
                    }
                    if (component === draggingOverElement) {
                        foundDragOver = true;
                    }
                });
            }
        }
    }

    function handleDragLeave(e) {
        e.preventDefault();
        e.target.classList.remove('dragging-over');
        // Remove shifting-down class from all components
        const components = document.querySelectorAll('.component');
        components.forEach(component => {
            component.classList.remove('shifting-down');
        });
    }



    planner.addEventListener('dragover', (e) => {
        e.preventDefault();
    });

    planner.addEventListener('drop', (e) => {
        e.preventDefault();
        const afterElement = getDragAfterElement(planner, e.clientY);
        if (isNewElement) {
            const type = draggedElement.dataset.type;
            const componentInfo = DefinedComponents.find(info => info.name === type);
            const component = componentInfo.create();

            component.classList.add('component');
            component.classList.add('component-wrapper');
            component.setAttribute('data-type', type);
            const clonedProperties = JSON.parse(JSON.stringify(componentInfo.properties));
            component.dataset.properties = JSON.stringify(clonedProperties);
            component.setAttribute('draggable', true);
            if (afterElement == null) {
                planner.appendChild(component);
            } else {
                planner.insertBefore(component, afterElement.nextSibling);
            }
            attachEventListeners(component);
        } else if (draggedElement) {
            if (afterElement == null) {
                planner.appendChild(draggedElement);
            } else {
                planner.insertBefore(draggedElement, afterElement);
            }
            draggedElement.classList.remove('dragging');
            draggedElement = null;
        }
        isNewElement = false;
        const components = document.querySelectorAll('.component');
        components.forEach(component => {
            component.classList.remove('dragging-over');
            component.classList.remove('shifting-down');
        });
    });

function createComponent(componentInfo) {
    const component = document.createElement('div');
    component.classList.add('component');
    component.setAttribute('draggable', true);
    component.setAttribute('data-type', componentInfo.name);
    component.innerText = componentInfo.displayText;

    // Clone properties to avoid reference issues
    const clonedProperties = JSON.parse(JSON.stringify(componentInfo.properties));
    component.dataset.properties = JSON.stringify(clonedProperties);

    // Attach event listeners to the newly created component
    attachEventListeners(component);

    return component;
}

DefinedComponents.forEach(componentInfo => {
    const newComponent = createComponent(componentInfo);
    sidebar.appendChild(newComponent);
});

function createPropertyInput(property, value, onChange, options = []) {

    //Form Control Creation
    const formControl = document.createElement('div');
    formControl.classList.add('form-control');

    //Form Check Control Creation
    const formCheck = document.createElement('div');
    formCheck.classList.add('form-check');

    const label = document.createElement('label');
    label.innerText = property;

    if (property == 'Color') {

        const Input = document.createElement('input');
        Input.type = 'color';
        Input.value = value;
        Input.addEventListener('input', () => onChange(Input.value));
        formControl.appendChild(label);
        formControl.appendChild(Input);
        propertyDetails.appendChild(formControl);

    } else if (property == 'Font Size') {

        const Select = document.createElement('select');
        Select.addEventListener('change', (event) => onChange(event.target.value));

        options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option;
            optionElement.innerText = option;
            Select.appendChild(optionElement);
        });

        Select.value = value;
        formControl.appendChild(label);
        formControl.appendChild(Select);
        propertyDetails.appendChild(formControl);

    } else if (property == 'Disabled') {

        const Checkbox = document.createElement('input');
        Checkbox.setAttribute('type', 'checkbox');
        Checkbox.checked = value === 'disabled';
        Checkbox.addEventListener('change', () => {
            const input = document.querySelector('.component.selected input[type="text"]');
            if (input) {
                input.disabled = Checkbox.checked;
                onChange(Checkbox.checked ? 'disabled' : 'enabled');
            }
        });

        formCheck.appendChild(label);
        formCheck.appendChild(Checkbox);
        propertyDetails.appendChild(formCheck);

    } else if (property == 'Label') {

        const inputElement = document.createElement('input');
        inputElement.type = 'text';
        inputElement.value = value;
        inputElement.addEventListener('input', () => onChange(inputElement.value));

        formControl.appendChild(label);
        formControl.appendChild(inputElement);
        propertyDetails.appendChild(formControl);

    } else if (property == 'Text') {

        const inputElement = document.createElement('input');
        inputElement.type = 'text';
        inputElement.value = value;
        inputElement.addEventListener('input', () => onChange(inputElement.value));

        formControl.appendChild(label);
        formControl.appendChild(inputElement);
        propertyDetails.appendChild(formControl);

    } else if (property == 'Id') {

        const inputElement = document.createElement('input');
        inputElement.type = 'text';
        inputElement.value = value;
        inputElement.addEventListener('input', () => onChange(inputElement.value));

        formControl.appendChild(label);
        formControl.appendChild(inputElement);
        propertyDetails.appendChild(formControl);
    } else if (property == 'Width') {

        const inputElement = document.createElement('input');
        inputElement.type = 'number';
        inputElement.value = value;
        inputElement.addEventListener('input', () => onChange(inputElement.value));

        formControl.appendChild(label);
        formControl.appendChild(inputElement);
        propertyDetails.appendChild(formControl);

    } else if (property == 'URL') {

        const inputElement = document.createElement('input');
        inputElement.type = 'text';
        inputElement.value = value;
        inputElement.addEventListener('input', () => onChange(inputElement.value));

        formControl.appendChild(label);
        formControl.appendChild(inputElement);
        propertyDetails.appendChild(formControl);

    } else if (property == 'Height') {

        const inputElement = document.createElement('input');
        inputElement.type = 'number';
        inputElement.value = value;
        inputElement.addEventListener('input', () => onChange(inputElement.value));

        formControl.appendChild(label);
        formControl.appendChild(inputElement);
        propertyDetails.appendChild(formControl);

    } else if (property == 'Class') {

        const inputElement = document.createElement('input');
        inputElement.type = 'text';
        inputElement.value = value;
        inputElement.addEventListener('input', () => onChange(inputElement.value));

        formControl.appendChild(label);
        formControl.appendChild(inputElement);
        propertyDetails.appendChild(formControl);

    } else if (property == 'Textarea') {

        const inputElement = document.createElement('textarea');
        inputElement.type = 'text';
        inputElement.value = value;
        inputElement.rows = 10;
        inputElement.addEventListener('input', () => onChange(inputElement.value));

        formControl.appendChild(label);
        formControl.appendChild(inputElement);
        propertyDetails.appendChild(formControl);
    }

}

function showProperties(component) {
    const type = component.dataset.type;
    propertyDetails.innerHTML = '';
    const properties = JSON.parse(component.dataset.properties);

    properties.forEach(property => {
        if (property.label === 'URL') {
            createPropertyInput(property.label, property.value, (value) => {
                property.value = value;
                component.dataset.properties = JSON.stringify(properties);
                updateComponent(component, properties);
            });
        } else {
            createPropertyInput(property.label, property.value, (value) => {
                property.value = value;
                component.dataset.properties = JSON.stringify(properties);
                updateComponent(component, properties);
            }, property.options || []);
        }
    });

    if (component.dataset.type === 'Image') {
        const uploadButton = document.createElement('button');
        uploadButton.innerText = 'Upload Image';
        uploadButton.addEventListener('click', () => {
            const fileInput = component.querySelector('input[type="file"]');
            fileInput.click();
        });

        propertyDetails.appendChild(uploadButton);
    }

    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'Delete';
    deleteButton.addEventListener('click', () => {
        if (confirm('Are you sure you want to delete this component?')) {
            component.remove(); // Remove the component from the DOM
            propertyDetails.innerHTML = ''; // Clear the property details panel
        }
    });
    propertyDetails.appendChild(deleteButton);
}

function updateComponent(component, properties) {
    properties.forEach(property => {
        if (property.label === 'Text') {
            component.innerText = property.value;
        } else if (property.label === 'Color') {
            component.style.color = property.value;
        } else if (property.label === 'Font Size') {
            component.style.fontSize = property.value;
        } else if (property.label === 'Disabled') {
            const input = component.querySelector('input[type="text"]');
            if (input) {
                input.disabled = property.value === 'disabled';
            }
        } else if (property.label === 'Label') { // Handle Label property
            const label = component.querySelector('label');
            if (label) {
                label.innerText = property.value;
            }
        } else if (property.label === 'URL') {
            component.setAttribute('href', property.value);
            component.setAttribute('target', '_blank');
        } else if (property.label === 'Width') {
            component.style.width = property.value + "px";
        } else if (property.label === 'Height') {
            component.style.height = property.value + "px";
        } else if (property.label === 'Id') {
            component.id = property.value;
        } else if (property.label === 'Class') {
            component.classList.add(property.value);
        } else if (property.label === 'Textarea') {
            component.innerText = property.value;
        }
    });

    if (component.dataset.type === 'Image') {
        const image = component.querySelector('img');
        if (image && image.src) {
            image.onload = () => {
                const maxWidth = 350;
                const ratio = image.naturalWidth > maxWidth ? maxWidth / image.naturalWidth : 1;
                const newWidth = image.naturalWidth * ratio;
                const newHeight = image.naturalHeight * ratio;
                component.style.width = newWidth + 'px';
                component.style.height = newHeight + 'px';
            };
        }
    }
}

function handleComponentClick(e) {
    const component = e.target.closest('.component');
    if (component && component.parentElement === planner) {
        showProperties(component);
        deselectComponents();
        component.classList.add('selected');
    }
}
function deselectComponents() {
    const selectedComponents = document.querySelectorAll('.component.selected');
    selectedComponents.forEach(component => {
        component.classList.remove('selected');
    });
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.component:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

document.getElementById('previewButton').addEventListener('click', () => {
    const formContent = planner.innerHTML;
    const previewWindow = window.open('', '_blank');
    previewWindow.document.write('<html>');
    previewWindow.document.write('<head>');
    previewWindow.document.write('<link rel="stylesheet" href="css.css">');
    previewWindow.document.write('</head>');
    previewWindow.document.write('<body>');
    previewWindow.document.write('<div class="preview">');
    previewWindow.document.write(formContent);
    previewWindow.document.write('</div>');
    previewWindow.document.write('</body></html>');
    previewWindow.document.close();
});

// Attach initial event listeners
const components = document.querySelectorAll('.component');
components.forEach(component => {
    component.setAttribute('draggable', true);
    component.addEventListener('dragstart', handleDragStart);
    component.addEventListener('dragend', handleDragEnd);
    component.addEventListener('click', handleComponentClick); // Attach click event listener
});
});
