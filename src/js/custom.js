const createUniqueId = prefix => {
  return `${prefix}-${Math.round(Math.random() * 100000)}`;
};

class RangeSlider {
  
  constructor(el) {
    this.input = document.querySelector(el);

    this.el = this.input.getAttribute('id');
    this.minValue = this.input.getAttribute('min');
    this.maxValue = this.input.getAttribute('max');
    
    this.numTicks = this.maxValue / this.minValue;
    
    this.input.addEventListener('change', (e) => this.handleInputChange(e));
    
    this.wrapInput().then(wrapperId => {
      if (this.input.hasAttribute('values')) {
        this.values = JSON.parse(this.input.getAttribute('values'));
        this.createTicks(wrapperId);
      }
    });
  }
  
  handleInputChange(e) {
    const value = e.target.value;
    const ariaValueText = !this.values ? value : this.values[value];
    
    this.input.setAttribute('aria-valuetext', ariaValueText);
    
    if (this.input.hasAttribute('values')) {
      this.setSelectedLabel(this.values[value]); 
    }
  }
  
  handleLabelClick(label, value, e) {
    this.input.focus();
    this.input.value = value;
    this.input.setAttribute('value', value);
    this.input.setAttribute('aria-valuetext', label); 
    this.setSelectedLabel(label);
  }
  
  setSelectedLabel(label) {
    const selectedLabels = this.input.parentNode.querySelectorAll('.range-slider-ticks__label');
    
    [].forEach.call(selectedLabels, el => {
      el.classList[el.innerText === label ? 'add' : 'remove']('is-selected'); 
    });
  }
  
  wrapInput() {
    return new Promise(resolve => {
      const wrapper = document.createElement('div');
      const wrapperId = createUniqueId('range-slider');

      wrapper.id = wrapperId;
      wrapper.className = 'range-slider';
      
      this.input.parentNode.replaceChild(wrapper, this.input);

      document.querySelector(`#${wrapperId}`).appendChild(this.input);
      
      resolve(wrapperId);
    });
  }
  
  createTicks(wrapperId) {
    return new Promise(resolve => {
      let index = 0;
      let tickLabelText;
      
      const tickList = document.createElement('div');
      const tickListId = createUniqueId('tick-list');
      
      const noLabels = this.input.hasAttribute('no-labels');
      const firstAndLastLabelsOnly = this.input.hasAttribute('first-last-labels-only');

      tickList.id = tickListId;
      tickList.className = 'range-slider-ticks';

      document.querySelector(`#${wrapperId}`).appendChild(tickList);
      
      for (const prop in this.values) {
        if (this.values.hasOwnProperty(prop)) {
          
          const isFirstOrLastLabel = 
            !!firstAndLastLabelsOnly 
            && index > 0 
            && index < Object.values(this.values).length - 1;
          
          const tick = document.createElement('div'); 
          const tickLabel = document.createElement('span'); 

          tickLabel.className = `
            range-slider-ticks__label ${this.input.value === prop ? 'is-selected' : ''}
          `;
          
          if (!noLabels) {
            tickLabelText = document.createTextNode(
              isFirstOrLastLabel ? '' : this.values[prop]
            );
            
            tickLabel.appendChild(tickLabelText);
          }

          
          tick.className = 'range-slider-ticks__tick'; 
          tick.addEventListener('click', (e) => this.handleLabelClick(this.values[prop], prop, e));
          tick.appendChild(tickLabel);
          
          document.querySelector(`#${tickListId}`).appendChild(tick);
          
          index += 1;
        }
      }

      resolve();
    });
  }
}

[].forEach.call(document.querySelectorAll('input[type="range"]'), el => {
  const id = `#${el.getAttribute('id')}`;
  return new RangeSlider(id);
});

$("#slider").roundSlider({
  min: 0,
  max: 100,
  step: 10,
  value: 10,
  sliderType: "min-range",
  handleShape: "dot",
  radius: 153,
  width: 50,
  handleSize: "-2",
  tooltipFormat: "changeTooltip",
  startAngle: "-87",
  endAngle: "-0",
  editableTooltip: "false",
  lineCap: "round",
  svgMode: true,
  pathColor: "#1F2124",
  rangeColor: "#11A8FD",
  borderColor: "#1F2124",
  borderWidth: 0
});

function changeTooltip(e) {
  var val = e.value, mode;
  if (val >= 30) mode = "Hot";
  else if (val <= 10) mode = "Cooling...";
  else mode = 'Warm...'

  return "<div>" + val + "℃" + "</div>" + "<div>" + mode + "<div>";
}