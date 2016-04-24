var React = require('react');
var classNames = require('classnames');
var RethinkDbClient = window.rethinkDbClient;

var ConnectionForm = React.createClass({
	getInitialState: function() {
    return this.props;
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState(nextProps);
  },
  handleTextChange: function(key, e) {
  	var attribute = this.state.connection;
  	attribute[key].value = e.target.value;
    this.setState(attribute);
  },
  handleValidation: function() {
  	var attributes = this.state.connection;
  	attributes.name.valid = this.state.connection.name.value ? true : false;
  	attributes.host.valid = this.state.connection.host.value ? true : false;
  	attributes.port.valid = this.state.connection.port.value ? true : false;
  	this.setState(attributes);
  },
	handleSubmit: function(e) {
    e.preventDefault();
    this.handleValidation();
    if(this.state.connection.name.valid && this.state.connection.host.valid && this.state.connection.port.valid) {
      // Save new favorite and turn off form
      if(this.state.action === 'Add') {
        RethinkDbClient.addFavorite(this.state.connection);
      } else {
        RethinkDbClient.editFavorite(this.state.connection);
      }
      RethinkDbClient.toggleConnectionForm();
    }
  },
  handleCancel: function(e) {
    e.preventDefault();
    RethinkDbClient.toggleConnectionForm();
  },
  handleDelete: function(e) {
    e.preventDefault();
    RethinkDbClient.deleteFavorite(this.state.connection);
    RethinkDbClient.toggleConnectionForm();
  },
  render: function() {
    var containerStyles = {
      display: this.state.show ? 'block' : 'none'
    };
  	// Validation Classes
  	var inputValidationClasses = {
  		name: classNames({
  			'form-group': true,
  			'has-error': !this.state.connection.name.valid
  		}),
  		host: classNames({
				'form-group': true,
  			'has-error': !this.state.connection.host.valid
  		}),
  		port: classNames({
  			'form-group': true,
  			'has-error': !this.state.connection.port.valid
  		}),
  		database: classNames({
  			'form-group': true
  		}),
  		authKey: classNames({
  			'form-group': true
  		})
  	};
    var deleteButton = '';
    if(this.state.action === 'Edit') {
      deleteButton = <button type="delete" className="btn btn-default" onClick={this.handleDelete}>Delete</button>
    }
    return (
      <div className="connectionForm" style={containerStyles}>
      	<div className="row">
	      	<div className="col-sm-12">
		        <form>
			    		<div className={inputValidationClasses.name}>
					    	<label htmlFor="name">Connection Name</label>
					    	<input type="text" className="form-control" id="name" placeholder="Connection Name" value={this.state.connection.name.value} onChange={this.handleTextChange.bind(this, 'name')} />
					  	</div>
					  	<div className={inputValidationClasses.host}>
					    	<label htmlFor="host">Host</label>
					    	<input type="text" className="form-control" id="host" placeholder="Host" value={this.state.connection.host.value} onChange={this.handleTextChange.bind(this, 'host')} />
					  	</div>
					  	<div className={inputValidationClasses.port}>
					    	<label htmlFor="port">Port</label>
					    	<input type="text" className="form-control" id="port" placeholder="Port" value={this.state.connection.port.value} onChange={this.handleTextChange.bind(this, 'port')} />
					  	</div>
					  	{/*<div className={inputValidationClasses.database}>
					    	<label htmlFor="database">Database</label>
					    	<input type="text" className="form-control" id="database" placeholder="Database" value={this.state.connection.database.value} onChange={this.handleTextChange.bind(this, 'database')} />
					  	</div>
					  	<div className={inputValidationClasses.authKey}>
					    	<label htmlFor="authKey">Auth Key</label>
					    	<input type="text" className="form-control" id="authKey" placeholder="Auth Key" value={this.state.connection.authKey.value} onChange={this.handleTextChange.bind(this, 'authKey')} />
					  	</div>*/}
							<button type="submit" className="btn btn-default" onClick={this.handleSubmit}>{this.state.action} Connection</button>
              <button type="cancel" className="btn btn-default" onClick={this.handleCancel}>Cancel</button>
              {deleteButton}
		        </form>
	        </div>
        </div>
      </div>
    );
  }
});

module.exports = ConnectionForm;