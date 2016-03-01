import React from 'react';
import Autosuggest from 'react-autosuggest';

var AutoSuggestion = React.createClass({
	propTypes: {
	    id: React.PropTypes.string,
		suggestions: React.PropTypes.array,
		onAdd: React.PropTypes.func,
		placeholder: React.PropTypes.string,
		onBlur: React.PropTypes.func,
		value: React.PropTypes.string
	},
	
	getInitialState: function(){
	    return {
			//value: '',
			value: this.props.value || '',
			suggestedTags: this.props.suggestions
		};
		// this.onChange = this.onChange.bind(this);
	},
	
	/* Called by autosuggestion component when it thinks that suggestions should be updated
	   parameter :
		input : object with following properties
			- value : the current value of the input
			- reason : string describing why Autosuggest thinks you might want to update suggestions. The possible values are: 'type', 'blur', 'click' etc...
	*/
	onSuggestionsUpdateRequested: function(input) {
		this.setState({
			suggestedTags: this.getSuggestions(input.value)
		});
	},
	
	onChange: function(event, input) {
		this.setState({
		  value: input.newValue
		});
	},
	
	/* Its an focus event handler, called when AutoSuggestion input gains focus. it updates the suggestion list when input gains focus by calling onSuggestionsUpdateRequested function */
	onAutoSuggestFocus: function(event){
		this.onSuggestionsUpdateRequested({value: event.target.value, reason: 'focus_event'});
	},
	
	/* This function is called when user selects any suggestion by clicking or by pressing enter key 
	   Parameters :
		   event : html event
		   suggestion : object with following properties
			   - suggestion - the selected suggestion
			   - suggestionValue - the value of the selected suggestion
			   - method : string describing how user selected the suggestion [possible values : 'click', 'enter']
	*/
	onSuggestionSelected: function(event, suggestion) {
	    this.addTags(suggestion.suggestionValue);
		if(this.props.onBlur){
		    this.props.onBlur(event);
		}
	},
	
	/* getSuggestionsValue is the required/mandatory function for autosuggestion component the function is called when user selects suggestion by using up/down key 
	   Parameters :
			suggestion : value of selected suggestion
	   returns a string
	*/
	getSuggestionsValue: function(suggestion) {
		return suggestion;
	},

	/* It contains the logic to filter the suggestions */
	getSuggestions: function(inputValue){
		var escapedValue = this.escapeRegexCharacters(inputValue.trim());

		if (escapedValue === '') {
		  return [];
		}
		var regex = new RegExp('^' + escapedValue, 'i');
		return this.props.suggestions.filter(suggestion => regex.test(suggestion));
	},
	
	escapeRegexCharacters: function(str) {
		return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	},

	handleBlur: function(event) {
        if(this.props.onBlur){
            this.props.onBlur(event);
        }
	},
	handleKeyDown: function(event){
	    if(this.props.onKeyDown){
	        this.props.onKeyDown(event);
	    }
	},
	addTags: function(tags) {
		if (this.props.onAdd) {
		  this.props.onAdd(tags);
		}
	},
	
	/* renderSuggestions is the required/mandatory function for autosuggestion component
       the function returns the react element to display the suggestions
	   Parameters :
			suggestion : The suggestion to render
	   returns react element
   */
	renderSuggestions: function(suggestion) {
		return <span value={suggestion}>{suggestion}</span>;
	},
	
	render: function() {
	    var suggestedTags = this.state.suggestedTags;
		var inputProps = {
			value: this.state.value,
			onChange: this.onChange,
			onBlur : this.handleBlur,
			onKeyDown : this.handleKeyDown,
			id: this.props.id
		};

		return (
		  <Autosuggest suggestions={suggestedTags} inputProps={inputProps}
		               onSuggestionsUpdateRequested={this.onSuggestionsUpdateRequested}
					   getSuggestionValue={this.getSuggestionsValue}
					   renderSuggestion={this.renderSuggestions}
					   onSuggestionSelected={this.onSuggestionSelected} />
		);
	}
});

module.exports = AutoSuggestion;