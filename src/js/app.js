import GitStorageDialogs from 'cwrc-git-dialogs';

const viaf = require('viaf-entity-lookup')
const dbpedia = require('dbpedia-entity-lookup');
const wikidata = require('wikidata-entity-lookup');
const getty = require('getty-entity-lookup');
const geonames = require('geonames-entity-lookup');
const lgpn = require('lgpn-entity-lookup');
const EntityLookupDialogs = require('cwrc-public-entity-dialogs');

const CWRCWriter = require('cwrc-writer-base');

EntityLookupDialogs.showNoLinkButton(true);
EntityLookupDialogs.showCreateNewButton(false);
EntityLookupDialogs.showEditButton(false);
EntityLookupDialogs.registerEntitySources({
	rs: (new Map()).set('viaf', viaf).set('wikidata', wikidata).set('dbpedia', dbpedia),
	person: (new Map()).set('viaf', viaf).set('wikidata', wikidata).set('getty', getty).set('dbpedia', dbpedia).set('lgpn', lgpn),
	place: (new Map()).set('geonames', geonames).set('viaf', viaf).set('dbpedia', dbpedia).set('wikidata', wikidata),
	organization: (new Map()).set('viaf', viaf).set('wikidata', wikidata).set('dbpedia', dbpedia),
	title: (new Map()).set('viaf', viaf).set('wikidata', wikidata).set('dbpedia', dbpedia)
})

// if (process.env.NODE_ENV === 'development') {
// 	GitStorageDialogs.setServerURL('http://localhost:3000/github');
// } else {
GitStorageDialogs.setServerURL('./github');
// }

const init = async () => {

	const configRequest = await fetch('./config/config.json')
		.catch( (err) => {
			console.log(err)
		});
	const config = await configRequest.json()

	// if (process.env.NODE_ENV === 'development') {
	// 	config.schema.schemaProxyUrl = 'http://localhost:3000';
	// }

	config.container = 'cwrcWriterContainer';
	config.modules = {
		west: [
			{id: 'structure', title: 'Markup'},
			{id: 'entities', title: 'Entities'},
			{id: 'nerve', title: 'NERVE', config: {
				'nerveUrl': config.nerveUrl
			}}
		],
		south: [
				{id: 'selection', title: 'Selection'},
				{id: 'validation', title: 'Validation', config: {
				'validationUrl': config.validationUrl
			}}
		],
		east: [
			{id: 'imageViewer', title: 'Image Viewer'}
		]
	};
	config.entityLookupDialogs = EntityLookupDialogs;
	config.storageDialogs = GitStorageDialogs;
	
	const writer = new CWRCWriter(config);	
	writer.utilities.addCSS('css/bootstrap.css');

	window.writer = writer;

	writer.event('writerInitialized').subscribe(() => {
		writer.showLoadDialog();
	});

}

init();