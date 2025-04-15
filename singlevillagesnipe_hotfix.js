/*
 * Script Name: Single Village Snipe
 * Version: v2.3.4
 * Last Updated: 2025-04-15
 * Author: RedAlert, quick fix by redex557
 * Author URL: https://twscripts.dev/
 * Approved: NO
 */

/*--------------------------------------------------------------------------------------
 * This script can NOT be cloned and modified without permission from the script author.
 --------------------------------------------------------------------------------------*/

var scriptData = {
    prefix: 'singleVillageSnipe',
    name: 'Single Village Snipe',
    version: 'v2.3.2',
    author: 'RedAlert',
    authorUrl: 'https://twscripts.dev/',
    helpLink:
        'https://forum.tribalwars.net/index.php?threads/single-village-snipe.286731/',
};

// User Input
if (typeof DEBUG !== 'boolean') DEBUG = true;
if (typeof REMAINING_TIME_ALERT === 'undefined')
    REMAINING_TIME_ALERT = '0:00:10';

// Constants
var LS_PREFIX = 'raSingleVillageSnipe';
var TIME_INTERVAL = 60 * 60 * 1000 * 24 * 1; // fetch data every 1 day
var GROUP_ID = localStorage.getItem(`${LS_PREFIX}_chosen_group`) ?? 0;
var LAST_UPDATED_TIME = localStorage.getItem(`${LS_PREFIX}_last_updated`) ?? 0;

// Globals
var unitInfo,
    villages = [],
    troopCounts = [];

// Translations
var translations = {
    en_DK: {
        'Single Village Snipe': 'Single Village Snipe',
        Help: 'Help',
        'This script can only be run on a single village screen!':
            'This script can only be run on a single village screen!',
        'Landing Time': 'Landing Time',
        'Calculate Launch Times': 'Calculate Launch Times',
        'Export as BB Code': 'Export as BB Code',
        'Landing time was updated!': 'Landing time was updated!',
        'Plan for:': 'Plan for:',
        'Landing Time:': 'Landing Time:',
        Unit: 'Unit',
        From: 'From',
        'Launch Time': 'Launch Time',
        Command: 'Command',
        Status: 'Status',
        Send: 'Send',
        'Error fetching village groups!': 'Error fetching village groups!',
        'Choose Units to Snipe': 'Choose Units to Snipe',
        Group: 'Group',
        'No possible snipe options found!': 'No possible snipe options found!',
        Distance: 'Distance',
        'An error occured while fetching troop counts!':
            'An error occured while fetching troop counts!',
        'snipe attempts found': 'snipe attempts found',
        'Nothing to export!': 'Nothing to export!',
        'Target:': 'Target:',
        'Send in': 'Send in',
        'Destination Village': 'Destination Village',
        Sigil: 'Sigil',
        'Min. Amount': 'Min. Amount',
        'Export Config': 'Export Config',
        'Import Config': 'Import Config',
        'Configuration imported successfully!':
            'Configuration imported successfully!',
        'Nothing to import!': 'Nothing to import!',
        'There was an error fetching villages by group!':
            'There was an error fetching villages by group!',
        'Reset Chosen Group': 'Reset Chosen Group',
        'Chosen group was reset!': 'Chosen group was reset!',
        'There was an error!': 'There was an error!',
        'Configuration has been copied!': 'Configuration has been copied!',
        'BBCode have been copied!': 'BBCode have been copied!',
        'This script requires Premium Account!':
            'This script requires Premium Account!',
        'Reset Script': 'Reset Script',
        'Script configuration has been reset!':
            'Script configuration has been reset!',
        'Send in:': 'Send in:',
        WB: 'WB',
        'Copied Command successfully': 'Copied Command successfully',
        'today at': 'today at',
        'tomorrow at': 'tomorrow at',
        on: 'on',
    },
    it_IT: {
        'Single Village Snipe': 'Snipe Singolo Villaggio',
        Help: 'Aiuto',
        'This script can only be run on a single village screen!':
            'Questo script puÃ² essere lanciato solo dalla panoramica del villaggio',
        'Landing Time': 'Tempo di arrivo',
        'Calculate Launch Times': 'Calcola tempi di lancio',
        'Export as BB Code': 'Esporta in BB code',
        'Landing time was updated!': 'Il tempo di arrivo Ã¨ stato aggiornato!',
        'Plan for:': 'Plan per:',
        'Landing Time:': 'Tempo di arrivo:',
        Unit: 'UnitÃ ',
        From: 'Da',
        'Launch Time': 'Tempo di lancio',
        Command: 'Comando',
        Status: 'Stato',
        Send: 'Invia',
        'Error fetching village groups!': 'Errore nel recupero gruppo!',
        'Choose Units to Snipe': `Scegli l'unitÃ  con cui ninjare`,
        Group: 'Gruppo',
        'No possible snipe options found!': 'Nessuna combinazione disponibile!',
        Distance: 'Distanza',
        'An error occured while fetching troop counts!':
            'Errore nel recupero conteggio truppe!',
        'snipe attempts found': 'Ninjata possibile trovata',
        'Nothing to export!': `Non c'Ã¨ niente da esportare!`,
        'Target:': 'Target:',
        'Send in': 'Lancia tra',
        'Destination Village': 'Villaggio di destinazione',
        Sigil: 'Sigillo',
        'Min. Amount': 'Qnt. Minima',
        'Export Config': 'Esporta configurazione',
        'Import Config': 'Importa configurazione',
        'Configuration imported successfully!':
            'Configurazione importat con successo!',
        'Nothing to import!': `Non c'Ã¨ nulla da importare!`,
        'There was an error fetching villages by group!':
            'There was an error fetching villages by group!',
        'Reset Chosen Group': 'Reset Chosen Group',
        'Chosen group was reset!': 'Chosen group was reset!',
        'There was an error!': `C'era un errore!`,
        'Configuration has been copied!': 'Configuration has been copied!',
        'BBCode have been copied!': 'BBCode have been copied!',
        'This script requires Premium Account!':
            'This script requires Premium Account!',
        'Reset Script': 'Reset Script',
        'Script configuration has been reset!':
            'Script configuration has been reset!',
        'Send in:': 'Send in:',
        WB: 'WB',
        'Copied Command successfully': 'Copied Command successfully',
        'today at': 'today at',
        'tomorrow at': 'tomorrow at',
        on: 'on',
    },
    pt_PT: {
        'Single Village Snipe': 'Aldeia Ãšnica Snipe',
        Help: 'Ajuda',
        'This script can only be run on a single village screen!':
            'Este script sÃ³ pode ser executado num Ãºnico ecrÃ£ da aldeia!',
        'Landing Time': 'Hora de chegada',
        'Calculate Launch Times': 'Calcular os tempos de lanÃ§amento',
        'Export as BB Code': ' Exportar como CÃ³digo BB ',
        'Landing time was updated!': 'A hora de aterragem foi atualizada!',
        'Plan for:': 'Plano para:',
        'Landing Time:': 'hora de aterragem:',
        Unit: 'Unidade',
        From: 'de',
        'Launch Time': 'Hora do lanÃ§amento',
        Command: 'Comando',
        Status: 'Estado',
        Send: 'Enviar',
        'Error fetching village groups!':
            'Erro a carregar os grupos de aldeias!',
        'Choose Units to Snipe': 'Escolha unidades para Snipe',
        Group: 'Grupo',
        'No possible snipe options found!':
            'NÃ£o foram encontradas possÃ­veis opÃ§Ãµes de snipe!',
        Distance: 'DistÃ¢ncia',
        'An error occured while fetching troop counts!':
            'Ocorreu um erro ao recolher as contagens das tropas!',
        'snipe attempts found': 'tentativas de snipe encontradas',
        'Nothing to export!': 'Nada para exportar!',
        'Target:': ' Alvo:',
        'Send in': 'Enviar em',
        'Destination Village': 'Aldeia de Destino',
        Sigil: 'Sigil',
        'Min. Amount': 'Min. quantidade',
        'Export Config': 'Exportar Config',
        'Import Config': 'Importar Config',
        'Configuration imported successfully!':
            'ConfiguraÃ§Ã£o importada com sucesso!',
        'Nothing to import!': 'Nada para importar!',
        'There was an error fetching villages by group!':
            'There was an error fetching villages by group!',
        'Reset Chosen Group': 'Reset Chosen Group',
        'Chosen group was reset!': 'Chosen group was reset!',
        'There was an error!': 'There was an error!',
        'Configuration has been copied!': 'Configuration has been copied!',
        'BBCode have been copied!': 'BBCode have been copied!',
        'This script requires Premium Account!':
            'This script requires Premium Account!',
        'Reset Script': 'Reset Script',
        'Script configuration has been reset!':
            'Script configuration has been reset!',
        'Send in:': 'Send in:',
        WB: 'WB',
        'Copied Command successfully': 'Copied Command successfully',
        'today at': 'today at',
        'tomorrow at': 'tomorrow at',
        on: 'on',
    },
    de_DE: {
        'Single Village Snipe': 'Single Village Snipe',
        Help: 'Hilfe',
        'This script can only be run on a single village screen!':
            'Das Skript kann nur auf der DorfÃ¼bersicht ausgefÃ¼hrt werden!',
        'Landing Time': 'Ankunftszeit',
        'Calculate Launch Times': 'Abschickzeiten berechnen',
        'Export as BB Code': 'Als BB Code exportieren',
        'Landing time was updated!': 'Ankunftszeit wurde aktualisiert!',
        'Plan for:': 'Plan fÃ¼r:',
        'Landing Time:': 'Ankunftszeit:',
        Unit: 'Einheit',
        From: 'Von',
        'Launch Time': 'Abschickzeit',
        Command: 'Kommand',
        Status: 'Status',
        Send: 'Abschicken',
        'Error fetching village groups!': 'Fehler DÃ¶rfergruppen zu laden!',
        'Choose Units to Snipe': 'WÃ¤hle Einheiten zum berechnen',
        Group: 'Gruppe',
        'No possible snipe options found!': 'Keine mÃ¶glichen Befehle gefunden!',
        Distance: 'Entfernung',
        'An error occured while fetching troop counts!':
            'Ein Fehler ist beim laden der Truppen Informationen aufgetreten!',
        'snipe attempts found': 'mÃ¶glichen Befehle gefunden',
        'Nothing to export!': 'Keine Daten zum exportieren gefunden!',
        'Target:': 'Ziel:',
        'Send in': 'Abschicken in',
        'Destination Village': 'Ziel Dorf',
        Sigil: 'Faktor',
        'Min. Amount': 'Min. Menge',
        'Export Config': 'Konfiguration exportieren',
        'Import Config': 'Konfiguration importieren',
        'Configuration imported successfully!':
            'Konfiguration erfolgreich importiert!',
        'Nothing to import!': 'Keine Daten zum importieren!',
        'There was an error fetching villages by group!':
            'Fehler DÃ¶rfer bei Gruppen zu laden!',
        'Reset Chosen Group': 'GewÃ¤hlte Gruppe zurÃ¼cksetzen',
        'Chosen group was reset!': 'GewÃ¤hlte Gruppe wurde zurÃ¼ckgesetzt!',
        'There was an error!': 'Es gab einen Fehler!',
        'Configuration has been copied!': 'Konfiguration wurde kopiert!',
        'BBCode have been copied!': 'BBCode wurde kopiert!',
        'This script requires Premium Account!':
            'Dieses Skript benÃ¶tigt einen Premium Account!',
        'Reset Script': 'Skript zurÃ¼cksetzen',
        'Script configuration has been reset!':
            'Skript Konfiguration wurde zurÃ¼ckgesetzt!',
        'Send in:': 'Abschicken in:',
        WB: 'WB',
        'Copied Command successfully': 'Befehl erfolgreich kopiert.',
        'today at': 'heute um',
        'tomorrow at': 'morgen um',
        on: 'am',
    },
    pt_BR: {
        'Single Village Snipe': 'Snip de Aldeia Ãšnica',
        Help: 'Ajuda',
        'This script can only be run on a single village screen!':
            'Este script sÃ³ pode ser executado em uma Ãºnica tela de aldeia!',
        'Landing Time': 'Hora de chegada',
        'Calculate Launch Times': 'Calcular horÃ¡rios de lanÃ§amento',
        'Export as BB Code': ' Exportar como cÃ³digo BB',
        'Landing time was updated!': 'A hora de chegada foi atualizada!',
        'Plan for:': 'Plano para:',
        'Landing Time:': 'Chegada:',
        Unit: 'Unidade',
        From: 'Origem',
        'Launch Time': 'Hora do lanÃ§amento',
        Command: 'Comando',
        Status: 'Estado',
        Send: 'Enviar',
        'Error fetching village groups!':
            'Erro a carregar os grupos de aldeias!',
        'Choose Units to Snipe': 'Escolha as unidades para o Snipe',
        Group: 'Grupo',
        'No possible snipe options found!':
            'Nenhuma opÃ§Ã£o possÃ­vel de ataque encontrado!',
        Distance: 'DistÃ¢ncia',
        'An error occured while fetching troop counts!':
            'Ocorreu um erro ao recolher as contagens das tropas!',
        'snipe attempts found': 'tentativas de snipe encontradas',
        'Nothing to export!': 'Nada para exportar!',
        'Target:': ' Alvo:',
        'Send in': 'Enviar em',
        'Destination Village': 'Aldeia de Destino',
        Sigil: 'AfliÃ§Ã£o',
        'Min. Amount': 'Min. quantidade',
        'Export Config': 'Exportar Config',
        'Import Config': 'Importar Config',
        'Configuration imported successfully!':
            'ConfiguraÃ§Ã£o importada com sucesso!',
        'Nothing to import!': 'Nada para importar!',
        'There was an error fetching villages by group!':
            'Houve um erro ao importar as vilas por grupo!',
        'Reset Chosen Group': 'Reiniciar grupo escolhido',
        'Chosen group was reset!': 'Grupo escolhido foi reiniciado!',
        'There was an error!': 'Houve um erro!',
        'Configuration has been copied!': 'ConfiguraÃ§Ã£o foi copiada!',
        'BBCode have been copied!': 'BBCode foi copiado!',
        'This script requires Premium Account!':
            'Este script requer uma conta premium!',
        'Reset Script': 'Reiniciar Script',
        'Script configuration has been reset!':
            'ConfiguraÃ§Ã£o do Script foi reiniciada!',
        'Send in:': 'Enviar Em:',
        WB: 'WB',
        'Copied Command successfully': 'Comando copiado com sucesso',
        'today at': 'hoje Ã s',
        'tomorrow at': 'amanhÃ£ Ã s',
        on: 'em',
    },
};

// Init Debug
initDebug();

if (LAST_UPDATED_TIME !== null) {
    // Fetch unit info only when needed
    if (Date.parse(new Date()) >= LAST_UPDATED_TIME + TIME_INTERVAL) {
        fetchUnitInfo();
    } else {
        unitInfo = JSON.parse(localStorage.getItem(`${LS_PREFIX}_unit_info`));
    }
} else {
    fetchUnitInfo();
}

// Initialize Single Village Snipe script
async function initVillageSnipe(groupId) {
    // run on script load
    villages = await fetchAllPlayerVillagesByGroup(groupId);
    troopCounts = await fetchTroopsForCurrentGroup(groupId);
    const groups = await fetchVillageGroups();
    const unitsTable = buildUnitsChoserTable();
    const content = prepareContent(groups, unitsTable);
    renderUI(content);

    if (DEBUG) {
        console.debug(`${scriptInfo()} groupId: `, groupId);
        console.debug(`${scriptInfo()} villages: `, villages);
        console.debug(`${scriptInfo()} troopCounts: `, troopCounts);
    }

    // after script has been loaded events
    setTimeout(function () {
        // set the default destination village
        let destinationVillage;
        if (mobiledevice) {
            destinationVillage = jQuery('.mobileKeyValue')
                .eq(0)
                .find('div')
                .eq(0)
                .text()
                .match(/\d+\|\d+/)[0];
        } else {
            destinationVillage = jQuery(
                '#content_value table table td:eq(2)'
            ).text();
        }

        if (`${LS_PREFIX}_${destinationVillage}` in localStorage) {
            const savedConfig = JSON.parse(
                localStorage.getItem(`${LS_PREFIX}_${destinationVillage}`)
            );
            const { landingTime, minAmount, sigil } = savedConfig;

            jQuery('#raLandingTime').val(landingTime);
            jQuery('#raMinAmount').val(minAmount);
            jQuery('#raSigil').val(sigil);
        } else {
            // set the default landing time
            const today = new Date().toLocaleString('en-GB').replace(',', '');
            jQuery('#raLandingTime').val(today);
        }

        jQuery('#raDestinationVillage').val(destinationVillage);
    }, 100);

    // scroll to element to focus user's attention
    if (!mobiledevice) {
        jQuery('html,body').animate(
            {
                scrollTop: jQuery('#raSingleVillageSnipe').offset().top - 8,
            },
            'slow'
        );
    }

    // action handlers
    calculateLaunchTimes();
    fillLandingTimeFromCommand();
    filterVillagesByChosenGroup();
    exportBBCode();
    exportConfig();
    importConfig();
    resetGroup();
    resetScriptHandler();
    autoFillLandingTimeFromUrl();
}

// Helper: Prepare UI
function prepareContent(groups, unitsTable) {
    const groupsFilter = renderGroupsFilter(groups);

    return `
		<div class="ra-mb15">
			<div class="ra-grid">
				<div>
					<label for="raDestinationVillage">
						${tt('Destination Village')}
					</label>
					<input id="raDestinationVillage" type="text" value="">
				</div>
				<div>
					<label for="raLandingTime">
						${tt('Landing Time')} (dd/mm/yyyy HH:mm:ss)
					</label>
					<input id="raLandingTime" type="text" value="">
				</div>
				<div>
					<label for="raLandingTime">
						${tt('Sigil')}
					</label>
					<input id="raSigil" type="text" value="0">
				</div>
				<div>
					<label>${tt('Min. Amount')}</label>
					<input id="raMinAmount" type="text" value="50">
				</div>
				<div>
					<label>${tt('Group')}</label>
					${groupsFilter}
				</div>
			</div>
		</div>
		<div class="ra-mb15">
			<label>${tt('Choose Units to Snipe')}</label>
			${unitsTable}
		</div>
		<div class="ra-mb15">
			<a href="javascript:void(0);" id="calculateLaunchTimes" class="btn btn-confirm-yes">
				${tt('Calculate Launch Times')}
			</a>
			<a href="javascript:void(0);" id="exportBBCodeBtn" class="btn" data-snipe="">
				${tt('Export as BB Code')}
			</a>
			<a href="javascript:void(0);" id="exportConfig" class="btn">
				${tt('Export Config')}
			</a>
			<a href="javascript:void(0);" id="importConfig" class="btn">
				${tt('Import Config')}
			</a>
			<a href="javascript:void(0);" id="resetGroupBtn" class="btn">
				${tt('Reset Chosen Group')}
			</a>
            <a href="javascript:void(0);" id="resetScriptBtn" class="btn">
				${tt('Reset Script')}
			</a>
		</div>
		<div style="display:none;" class="ra-mb15" id="raPossibleCombinations">
			<label><span id="possibleCombinationsCount">0</span> ${tt(
                'snipe attempts found'
            )}</label>
			<div id="possibleCombinationsTable"></div>
		</div>
	`;
}

// Render UI
function renderUI(body) {
    const content = `
        <div class="ra-single-village-snipe" id="raSingleVillageSnipe">
            <h2>${tt(scriptData.name)}</h2>
            <div class="ra-single-village-snipe-data">
                ${body}
            </div>
            <small>
                <strong>
                    ${tt(scriptData.name)} ${scriptData.version}
                </strong> -
                <a href="${
                    scriptData.authorUrl
                }" target="_blank" rel="noreferrer noopener">
                    ${scriptData.author}
                </a> -
                <a href="${
                    scriptData.helpLink
                }" target="_blank" rel="noreferrer noopener">
                    ${tt('Help')}
                </a>
            </small>
        </div>
        <style>
            .ra-single-village-snipe { position: relative; display: block; width: auto; height: auto; clear: both; margin: 0 auto 15px; padding: 10px; border: 1px solid #603000; box-sizing: border-box; background: #f4e4bc; }
			.ra-single-village-snipe * { box-sizing: border-box; }
			.ra-single-village-snipe input[type="text"] { width: 100%; padding: 5px 10px; border: 1px solid #000; font-size: 16px; line-height: 1; }
			.ra-single-village-snipe label { font-weight: 600 !important; margin-bottom: 5px; display: block; }
			.ra-single-village-snipe select { width: 100%; padding: 5px 10px; border: 1px solid #000; font-size: 16px; line-height: 1; }
			.ra-single-village-snipe .btn-confirm-yes { padding: 3px; }
			
			${
                mobiledevice
                    ? '.ra-single-village-snipe { margin: 5px; border-radius: 10px; } .ra-single-village-snipe h2 { margin: 0 0 10px 0; font-size: 18px; } .ra-single-village-snipe .ra-grid { grid-template-columns: 1fr } .ra-single-village-snipe .ra-grid > div { margin-bottom: 15px; } .ra-single-village-snipe .btn { margin-bottom: 8px; margin-right: 8px; } .ra-single-village-snipe select { height: auto; } .ra-single-village-snipe input[type="text"] { height: auto; } .ra-hide-on-mobile { display: none; }'
                    : '.ra-single-village-snipe .ra-grid { display: grid; grid-template-columns: 150px 1fr 100px 150px 150px; grid-gap: 0 20px; }'
            }
			
			/* Normal Table */
			.ra-table { border-collapse: separate !important; border-spacing: 2px !important; }
			.ra-table label,
			.ra-table input { cursor: pointer; margin: 0; }
			.ra-table th { font-size: 14px; }
			.ra-table th,
            .ra-table td { padding: 4px; text-align: center; }
            .ra-table td a { word-break: break-all; }
			.ra-table tr:nth-of-type(2n+1) td { background-color: #fff5da; }
			.ra-table a:focus:not(a.btn) { color: blue; }
			/* Popup Content */
			.ra-popup-content { position: relative; display: block; width: 360px; }
			.ra-popup-content * { box-sizing: border-box; }
			.ra-popup-content label { font-weight: 600 !important; margin-bottom: 5px; display: block; }
			.ra-popup-content textarea { width: 100%; height: 100px; resize: none; }
			/* Helpers */
			.ra-mb15 { margin-bottom: 15px; }
			.ra-mb30 { margin-bottom: 30px; }
			.ra-chosen-command td { background-color: #ffe563 !important; }
			.ra-text-left { text-align: left !important; }
			.ra-text-center { text-align: center !important; }
			.ra-unit-count { display: inline-block; margin-top: 3px; vertical-align: top; }
        </style>
    `;

    if (jQuery('.ra-single-village-snipe').length < 1) {
        if (mobiledevice) {
            jQuery('#mobileContent').prepend(content);
        } else {
            jQuery('#contentContainer').prepend(content);
        }
    } else {
        jQuery('.ra-single-village-snipe-data').html(body);
    }
}

// Action Handler: Export Config
function exportConfig() {
    jQuery('#exportConfig').on('click', function (e) {
        const destinationVillage = jQuery('#raDestinationVillage').val();
        const landingTime = jQuery('#raLandingTime').val();
        const sigil = jQuery('#raSigil').val();
        const minAmount = jQuery('#raMinAmount').val();

        const data = {
            destinationVillage: destinationVillage,
            landingTime: landingTime,
            sigil: sigil,
            minAmount: minAmount,
        };

        const content = `
			<div class="ra-popup-content">
				<textarea readonly id="exportConfigInput">${JSON.stringify(data)}</textarea>
			</div>
		`;

        Dialog.show('content', content);
        UI.SuccessMessage(tt('Configuration has been copied!'));
        jQuery('#exportConfigInput').select();
        document.execCommand('copy');
    });
}

// Action Handler: Export Config
function importConfig() {
    jQuery('#importConfig').on('click', function (e) {
        const content = `
			<div class="ra-popup-content">
				<textarea id="importConfigField"></textarea>
				<a href="javascript:void(0);" id="importConfigBtn" class="btn">${tt(
                    'Import Config'
                )}</a>
			</div>
		`;
        Dialog.show('content', content);

        jQuery('#importConfigBtn').on('click', function (e) {
            e.preventDefault();
            const config = jQuery('#importConfigField').val();
            if (config.length) {
                const data = JSON.parse(config);
                const { destinationVillage, landingTime, minAmount, sigil } =
                    data;
                jQuery('#raDestinationVillage').val(destinationVillage);
                jQuery('#raLandingTime').val(landingTime);
                jQuery('#raSigil').val(sigil);
                jQuery('#raMinAmount').val(minAmount);
                jQuery('#calculateLaunchTimes').trigger('click');
                UI.SuccessMessage(tt('Configuration imported successfully!'));
            } else {
                UI.ErrorMessage(tt('Nothing to import!'));
            }
        });
    });
}

// Action Handler: Reset chosen group
function resetGroup() {
    jQuery('#resetGroupBtn').on('click', function (e) {
        e.preventDefault();
        localStorage.removeItem(`${LS_PREFIX}_chosen_group`);
        UI.SuccessMessage(tt('Chosen group was reset!'));
        initVillageSnipe(0);
    });
}

// Action Handler: Grab the "chosen" villages and calculate their launch times based on the unit type
function calculateLaunchTimes() {
    jQuery('#calculateLaunchTimes').on('click', function (e) {
        e.preventDefault();

        // collect user input and destination village
        const landingTimeString = jQuery('#raLandingTime').val().trim();
        const destinationVillage = jQuery('#raDestinationVillage').val().trim();
        const minAmount = parseInt(jQuery('#raMinAmount').val().trim());
        const chosenUnits = [];

        jQuery('.ra-unit-selector').each(function () {
            if (jQuery(this).is(':checked')) {
                chosenUnits.push(this.value);
            }
        });

        if (chosenUnits.length) {
            localStorage.setItem(
                `${LS_PREFIX}_chosen_units`,
                JSON.stringify(chosenUnits)
            );
        }

        handleSaveConfig();

        if (DEBUG) {
            console.debug(
                `${scriptInfo()} landingTimeString:`,
                landingTimeString
            );
            console.debug(
                `${scriptInfo()} destinationVillage:`,
                destinationVillage
            );
            console.debug(`${scriptInfo()} minAmount:`, minAmount);
            console.debug(`${scriptInfo()} chosenUnits:`, chosenUnits);
        }

        // helper variables
        const landingTime = getLandingTime(landingTimeString);
        const serverTime = getServerTime();

        const possibleSnipes = [];
        const realSnipes = [];

        villages.forEach((village) => {
            const { id, name, coords } = village;
            const distance = calculateDistance(coords, destinationVillage);

            chosenUnits.forEach((unit) => {
                const launchTime = getLaunchTime(unit, landingTime, distance);
                if (launchTime > serverTime.getTime()) {
                    const formattedLaunchTime = formatDateTime(launchTime);
                    if (distance > 0) {
                        possibleSnipes.push({
                            id: id,
                            name: name,
                            unit: unit,
                            coords: coords,
                            distance: distance,
                            launchTime: launchTime,
                            formattedLaunchTime: formattedLaunchTime,
                        });
                    }
                }
            });
        });

        possibleSnipes.sort((a, b) => {
            return a.launchTime - b.launchTime;
        });

        // filter possible snipes to only show villages with available units
        possibleSnipes.forEach((snipe) => {
            const { id, unit } = snipe;
            troopCounts.forEach((villageTroops) => {
                if (!chosenUnits.includes('snob')) {
                    if (
                        villageTroops.villageId === id &&
                        villageTroops[unit] >= minAmount
                    ) {
                        snipe = {
                            ...snipe,
                            unitAmount: villageTroops[unit],
                        };
                        realSnipes.push(snipe);
                    }
                } else {
                    if (
                        villageTroops.villageId === id &&
                        villageTroops[unit] >= 1
                    ) {
                        snipe = {
                            ...snipe,
                            unitAmount: villageTroops[unit],
                        };
                        realSnipes.push(snipe);
                    }
                }
            });
        });

        if (DEBUG) {
            console.debug(`${scriptInfo()} troopCounts:`, troopCounts);
            console.debug(`${scriptInfo()} possibleSnipes:`, possibleSnipes);
            console.debug(`${scriptInfo()} realSnipes:`, realSnipes);
        }

        if (realSnipes.length > 0) {
            const snipeCombinationsTable = buildCombinationsTable(
                realSnipes,
                destinationVillage
            );
            jQuery('#raPossibleCombinations').show();
            jQuery('#possibleCombinationsCount').text(realSnipes.length);
            jQuery('#possibleCombinationsTable').html(snipeCombinationsTable);
            jQuery('#exportBBCodeBtn').attr(
                'data-snipe',
                JSON.stringify(realSnipes)
            );

            jQuery(window.TribalWars)
                .off()
                .on('global_tick', function () {
                    const remainingTime = jQuery(
                        '#possibleCombinationsTable .ra-table tbody tr:eq(0) span[data-endtime]'
                    )
                        .text()
                        .trim();
                    if (remainingTime === REMAINING_TIME_ALERT) {
                        TribalWars.playSound('chat');
                    }
                    document.title = tt('Send in:') + ' ' + remainingTime;
                });

            Timing.tickHandlers.timers.handleTimerEnd = function (e) {
                jQuery(this).closest('tr').remove();
            };

            Timing.tickHandlers.timers.init();
        } else {
            UI.ErrorMessage(tt('No possible snipe options found!'));
            jQuery('#raPossibleCombinations').hide();
            jQuery('#possibleCombinationsCount').text(0);
            jQuery('#possibleCombinationsTable').html('');
            jQuery('#exportBBCodeBtn').attr('data-snipe', '');
        }
    });
}

// Action Handler: When a command is clicked fill landing time with the landing time of the command
function fillLandingTimeFromCommand() {
    // add from "/game.php?screen=info_village&id=XXXX" screen
    jQuery(
        '#commands_outgoings table tbody tr.command-row, #commands_incomings table tbody tr.command-row'
    ).on('click', function () {
        try {
            jQuery(
                '#commands_outgoings table tbody tr.command-row'
            ).removeClass('ra-chosen-command');
            jQuery(this).addClass('ra-chosen-command');

            const commandLandingTime = jQuery(this)
                .find('td:eq(1)')
                .text()
                .trim();
            const landingTime = getTimeFromString(commandLandingTime);

            jQuery('#raLandingTime').val(landingTime);
            UI.SuccessMessage(tt('Landing time was updated!'));
        } catch (error) {
            UI.ErrorMessage(tt('There was an error!'));
            console.error(`${scriptInfo} Error: `, error);
        }
    });
}

// Action Handler: Filter villages shown by selected group
function filterVillagesByChosenGroup() {
    jQuery('#raGroupsFilter').on('change', function (e) {
        e.preventDefault();

        if (DEBUG) {
            console.debug(
                `${scriptInfo()} selected group ID: `,
                e.target.value
            );
        }

        localStorage.setItem(`${LS_PREFIX}_chosen_group`, e.target.value);
        initVillageSnipe(e.target.value);
    });
}

// Helper: Copy string to clipboard
function copyTextToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.style.position = 'fixed';
    textArea.style.top = 0;
    textArea.style.left = 0;
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = 0;
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        document.execCommand('copy');
        UI.SuccessMessage(tt('Copied Command successfully'));
    } catch (err) {}
    document.body.removeChild(textArea);
}

// Action Handler: Export snipe attempts list as BB Code
function exportBBCode() {
    jQuery('#exportBBCodeBtn').on('click', function (e) {
        e.preventDefault();

        const snipeAttempts = jQuery(this).attr('data-snipe');
        if (snipeAttempts) {
            jQuery(this).addClass('btn-confirm-yes');
            const snipeAttemptsJSON = JSON.parse(snipeAttempts);
            const bbCodeSnipes = getBBCodeExport(snipeAttemptsJSON);
            const content = `
				<div class="ra-popup-content">
					<label for="exportBBCodeInput">${tt('Export as BB Code')}</label>
					<textarea readonly id="exportBBCodeInput">${bbCodeSnipes.trim()}</textarea>
				</div>
			`;
            Dialog.show('content', content);
            UI.SuccessMessage(tt('BBCode have been copied!'));
            $('#exportBBCodeInput').select();
            document.execCommand('copy');
        } else {
            UI.ErrorMessage(tt('Nothing to export!'));
        }
    });
}

// Action Handler: Reset script configuration handler
function resetScriptHandler() {
    jQuery('#resetScriptBtn').on('click', function (e) {
        e.preventDefault();

        const localStorageKeys = Object.keys(localStorage);
        localStorageKeys.forEach((key) => {
            if (key.startsWith(`${LS_PREFIX}_`)) {
                localStorage.removeItem(key);
            }
        });

        UI.SuccessMessage(tt('Script configuration has been reset!'));
        setTimeout(function () {
            window.location.reload();
        }, 500);
    });
}

// Save configuration for village
function handleSaveConfig() {
    const landingTime = jQuery('#raLandingTime').val().trim();
    const destinationVillage = jQuery('#raDestinationVillage').val().trim();
    const minAmount = parseInt(jQuery('#raMinAmount').val().trim());
    const sigil = parseInt(jQuery('#raSigil').val().trim());
    const chosenUnits = [];

    jQuery('.ra-unit-selector').each(function () {
        if (jQuery(this).is(':checked')) {
            chosenUnits.push(this.value);
        }
    });

    if (chosenUnits.length) {
        localStorage.setItem(
            `${LS_PREFIX}_chosen_units`,
            JSON.stringify(chosenUnits)
        );
    }

    const data = {
        landingTime: landingTime,
        destinationVillage: destinationVillage,
        sigil: sigil,
        minAmount: minAmount,
        chosenUnits: chosenUnits,
    };

    localStorage.setItem(
        `${LS_PREFIX}_${destinationVillage}`,
        JSON.stringify(data)
    );
}

// Fill landing time field from URL
function autoFillLandingTimeFromUrl() {
    setTimeout(() => {
        const landingTime = getParameterByName('landingTime');
        if (landingTime) {
            const formattedLandingTime = formatDateTime(parseInt(landingTime));
            jQuery('#raLandingTime').val(formattedLandingTime);
        }
    }, 100);
}

// Prepare Units Selector
function buildUnitsChoserTable() {
    const storedChosenUnits = JSON.parse(
        localStorage.getItem(`${LS_PREFIX}_chosen_units`)
    );

    if (DEBUG) {
        console.debug(`${scriptInfo()} storedChosenUnits:`, storedChosenUnits);
    }

    let unitsTable = ``;

    let thUnits = ``;
    let tableRow = ``;

    if (storedChosenUnits !== null && storedChosenUnits !== undefined) {
        game_data.units.forEach((unit) => {
            if (unit !== 'spy' && unit !== 'militia') {
                // automatically check defensive units
                let checked = '';
                if (storedChosenUnits.includes(unit)) {
                    checked = `checked`;
                }

                thUnits += `
					<th class="ra-text-center">
						<label for="unit_${unit}">
							<img src="/graphic/unit/unit_${unit}.webp">
						</label>
					</th>
				`;

                tableRow += `
					<td class="ra-text-center">
						<input name="ra_chosen_units" type="checkbox" ${checked} id="unit_${unit}" class="ra-unit-selector" value="${unit}" />
					</td>
				`;
            }
        });
    } else {
        game_data.units.forEach((unit) => {
            if (unit !== 'spy' && unit !== 'militia') {
                // automatically check defensive units
                let checked = '';
                if (
                    unit === 'spear' ||
                    unit === 'sword' ||
                    unit === 'archer' ||
                    unit === 'heavy' ||
                    unit === 'catapult'
                ) {
                    checked = `checked`;
                }

                thUnits += `
					<th class="ra-text-center">
						<label for="unit_${unit}">
							<img src="/graphic/unit/unit_${unit}.webp">
						</label>
					</th>
				`;

                tableRow += `
					<td class="ra-text-center">
						<input name="ra_chosen_units" type="checkbox" ${checked} id="unit_${unit}" class="ra-unit-selector" value="${unit}" />
					</td>
				`;
            }
        });
    }

    unitsTable = `
		<table class="ra-table vis" width="100%" id="raUnitSelector">
			<thead>
				<tr>
					${thUnits}
				</tr>
			</thead>
			<tbody>
				<tr>
					${tableRow}
				</tr>
			</tbody>
		</table>
	`;

    return unitsTable;
}

// Render Combinations Table
function buildCombinationsTable(snipes, destinationVillage) {
    let combinationsTable = `
		<table class="ra-table vis" width="100%">
			<thead>
				<tr>
					<th>
						#
					</th>
					<th class="ra-text-left">
						${tt('From')}
					</th>
					<th>
						${tt('Unit')}
					</th>
					<th class="ra-hide-on-mobile">
						${tt('Distance')}
					</th>
					<th>
						${tt('Launch Time')}
					</th>
					<th>
						${tt('Send in')}
					</th>
					<th>
						${tt('Send')}
					</th>
					 <th>
						${tt('WB')}
					</th>
				</tr>
			</thead>
		<tbody>
	`;

    const serverTime = getServerTime().getTime();
    const arrivalTime = getLandingTime(
        jQuery('#raLandingTime').val().trim()
    ).getTime();

    snipes.forEach((snipe, index) => {
        const {
            id,
            name,
            coords,
            unit,
            distance,
            launchTime,
            formattedLaunchTime,
            unitAmount,
        } = snipe;
        const [toX, toY] = destinationVillage.split('|');
        const continent = getContinentByCoord(coords);
        const timeTillLaunch = secondsToHms((launchTime - serverTime) / 1000);

        let rallyPointData =
            game_data.market !== 'uk'
                ? `&x=${toX}&y=${toY}&${unit}=${unitAmount}`
                : '';
        let sitterData =
            game_data.player.sitter > 0 ? `t=${game_data.player.id}` : '';

        let commandUrl = `/game.php?${sitterData}&village=${id}&screen=place${rallyPointData}`;

        let attackType = 'snob'.includes(unit)
            ? 11
            : 'axelightramcatapultmarcher'.includes(unit)
            ? 8
            : 0;
        let wbCommand = `${id}&${
            VillageInfo.village_id
        }&${unit}&${arrivalTime}&${attackType}&false&false&${unit}=${btoa(
            unitAmount
        )}\\n`;

        let wbButton =
            game_data.market !== 'uk'
                ? `
                    <td>
                        <a  target="_blank" rel="noopener noreferrer" class="btn" onclick="copyTextToClipboard('${wbCommand}');">
                            ${tt('WB')}
                        </a>
                    </td>
                `
                : 'N/A';

        combinationsTable += `
			<tr>
				<td>
					${index + 1}
				</td>
				<td class="ra-text-left">
					<a href="${
                        game_data.link_base_pure
                    }info_village&id=${id}" target="_blank" rel="noopener noreferrer">
						${name} (${coords}) K${continent}
					</a>
				</td>
				<td>
					<img src="/graphic/unit/unit_${unit}.webp" /> <span class="ra-unit-count">${formatAsNumber(
            unitAmount
        )}</span>
				</td>
				<td class="ra-hide-on-mobile">
					${parseFloat(distance).toFixed(2)}
				</td>
				<td>
					${formattedLaunchTime}
				</td>
				<td>
					<span class="timer" data-endtime>${timeTillLaunch}</span>
				</td>
				<td>
					<a href="${commandUrl}" target="_blank" rel="noopener noreferrer" class="btn">
						${tt('Send')}
					</a>
				</td>
				${wbButton}
			</tr>
		`;
    });

    combinationsTable += `
			</tbody>
		</table>
	`;

    return combinationsTable;
}

// Helper: Convert Seconds to Hour:Minutes:Seconds
function secondsToHms(timestamp) {
    const hours = Math.floor(timestamp / 60 / 60);
    const minutes = Math.floor(timestamp / 60) - hours * 60;
    const seconds = timestamp % 60;
    const formatted =
        hours.toString().padStart(2, '0') +
        ':' +
        minutes.toString().padStart(2, '0') +
        ':' +
        seconds.toString().padStart(2, '0');
    return formatted;
}

// Helper: Get BB Code export for snipe attempts
function getBBCodeExport(snipes) {
    const landingTime = jQuery('#raLandingTime').val().trim();
    const destinationVillage = jQuery('#raDestinationVillage').val().trim();

    let bbCode = `[size=12][b]${tt(
        'Target:'
    )}[/b] ${destinationVillage}\n[b]${tt(
        'Landing Time:'
    )}[/b] ${landingTime}[/size]\n\n`;
    bbCode += `[table][**]${tt('Unit')}[||]${tt('From')}[||]${tt(
        'Launch Time'
    )}[||]${tt('Command')}[||]${tt('Status')}[/**]\n`;

    snipes.forEach((plan) => {
        const { coords, formattedLaunchTime, id, unit, unitAmount } = plan;

        const [toX, toY] = destinationVillage.split('|');

        let rallyPointData =
            game_data.market !== 'uk'
                ? `&x=${toX}&y=${toY}&${unit}=${unitAmount}`
                : '';
        let sitterData =
            game_data.player.sitter > 0 ? `t=${game_data.player.id}` : '';

        let commandUrl = `/game.php?${sitterData}&village=${id}&screen=place${rallyPointData}`;

        bbCode += `[*][unit]${unit}[/unit] ${formatAsNumber(
            unitAmount
        )}[|] ${coords} [|]${formattedLaunchTime}[|][url=${
            window.location.origin
        }${commandUrl}]${tt('Send')}[/url][|]\n`;
    });

    bbCode += `[/table]`;
    return bbCode;
}

// Helper: Process coordinate and extract coordinate continent
function getContinentByCoord(coord) {
    let [x, y] = Array.from(coord.split('|')).map((e) => parseInt(e));
    for (let i = 0; i < 1000; i += 100) {
        //x axes
        for (let j = 0; j < 1000; j += 100) {
            //y axes
            if (i >= x && x < i + 100 && j >= y && y < j + 100) {
                let nr_continent = parseInt(y / 100) + '' + parseInt(x / 100);
                return nr_continent;
            }
        }
    }
}

// Helper: Calculate distance between 2 villages
function calculateDistance(from, to) {
    const [x1, y1] = from.split('|');
    const [x2, y2] = to.split('|');
    const deltaX = Math.abs(x1 - x2);
    const deltaY = Math.abs(y1 - y2);
    return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
}

// Helper: Get launch time of command
function getLaunchTime(unit, landingTime, distance) {
    const msPerSec = 1000;
    const secsPerMin = 60;
    const msPerMin = msPerSec * secsPerMin;

    const sigilPercentage = +jQuery('#raSigil').val();
    const sigilRatio = 1 + sigilPercentage / 100;

    const unitSpeed = unitInfo.config[unit].speed;
    const unitTime = (distance * unitSpeed * msPerMin) / sigilRatio;

    const launchTime = new Date();
    launchTime.setTime(
        Math.round((landingTime - unitTime) / msPerSec) * msPerSec
    );

    return launchTime.getTime();
}

// Helper: Get server time
function getServerTime() {
    const serverTime = jQuery('#serverTime').text();
    const serverDate = jQuery('#serverDate').text();

    const [day, month, year] = serverDate.split('/');
    const serverTimeFormatted =
        year + '-' + month + '-' + day + ' ' + serverTime;
    const serverTimeObject = new Date(serverTimeFormatted);

    return serverTimeObject;
}

// Helper: Format date and time
function formatDateTime(date) {
    let currentDateTime = new Date(date);

    var currentYear = currentDateTime.getFullYear();
    var currentMonth = currentDateTime.getMonth();
    var currentDate = currentDateTime.getDate();
    var currentHours = '' + currentDateTime.getHours();
    var currentMinutes = '' + currentDateTime.getMinutes();
    var currentSeconds = '' + currentDateTime.getSeconds();

    currentMonth = currentMonth + 1;
    currentMonth = '' + currentMonth;
    currentMonth = currentMonth.padStart(2, '0');

    currentHours = currentHours.padStart(2, '0');
    currentMinutes = currentMinutes.padStart(2, '0');
    currentSeconds = currentSeconds.padStart(2, '0');

    let formatted_date =
        currentDate +
        '/' +
        currentMonth +
        '/' +
        currentYear +
        ' ' +
        currentHours +
        ':' +
        currentMinutes +
        ':' +
        currentSeconds;

    return formatted_date;
}

// Helper: Get landing time date object
function getLandingTime(landingTime) {
    const [landingDay, landingHour] = landingTime.split(' ');
    const [day, month, year] = landingDay.split('/');
    const [hours, minutes, seconds, milliseconds] = landingHour.split(':');
    const landingHourFormatted = `${hours}:${minutes}:${seconds}`;
    const landingTimeFormatted =
        year + '-' + month + '-' + day + ' ' + landingHourFormatted;
    const landingTimeObject = new Date(landingTimeFormatted);
    return landingTimeObject;
}

// Helper: Render groups filter
function renderGroupsFilter(groups) {
    const groupId = localStorage.getItem(`${LS_PREFIX}_chosen_group`) ?? 0;
    let groupsFilter = `
		<select name="ra_groups_filter" id="raGroupsFilter">
	`;

    for (const [_, group] of Object.entries(groups.result)) {
        const { group_id, name } = group;
        const isSelected =
            parseInt(group_id) === parseInt(groupId) ? 'selected' : '';
        if (name !== undefined) {
            groupsFilter += `
				<option value="${group_id}" ${isSelected}>
					${name}
				</option>
			`;
        }
    }

    groupsFilter += `
		</select>
	`;

    return groupsFilter;
}

// Helper: Fetch player villages by group
async function fetchAllPlayerVillagesByGroup(groupId) {
    try {
        let fetchVillagesUrl = '';
        if (game_data.player.sitter > 0) {
            fetchVillagesUrl =
                game_data.link_base_pure +
                `groups&ajax=load_villages_from_group&t=${game_data.player.id}`;
        } else {
            fetchVillagesUrl =
                game_data.link_base_pure +
                'groups&ajax=load_villages_from_group';
        }
        const villagesByGroup = await jQuery
            .post({
                url: fetchVillagesUrl,
                data: {
                    group_id: groupId,
                },
                dataType: 'json',
                headers: {
                    'TribalWars-Ajax': 1,
                },
            })
            .then(({ response }) => {
                const parser = new DOMParser();
                const htmlDoc = parser.parseFromString(
                    response.html,
                    'text/html'
                );
                const tableRows = jQuery(htmlDoc)
                    .find('#group_table > tbody > tr')
                    .not(':eq(0)');

                if (tableRows.length) {
                    let villagesList = [];

                    tableRows.each(function () {
                        const villageId =
                            jQuery(this)
                                .find('td:eq(0) a')
                                .attr('data-village-id') ??
                            jQuery(this)
                                .find('td:eq(0) a')
                                .attr('href')
                                .match(/\d+/)[0];
                        const villageName = jQuery(this)
                            .find('td:eq(0)')
                            .text()
                            .trim();
                        const villageCoords = jQuery(this)
                            .find('td:eq(1)')
                            .text()
                            .trim();

                        villagesList.push({
                            id: parseInt(villageId),
                            name: villageName,
                            coords: villageCoords,
                        });
                    });

                    return villagesList;
                } else {
                    return [];
                }
            });

        return villagesByGroup;
    } catch (error) {
        UI.ErrorMessage(tt('There was an error fetching villages by group!'));
        console.error(`${scriptInfo()} Error:`, error);
        return [];
    }
}

// Helper: Fetch village groups
async function fetchVillageGroups() {
    let fetchGroups = '';
    if (game_data.player.sitter > 0) {
        fetchGroups =
            game_data.link_base_pure +
            `groups&mode=overview&ajax=load_group_menu&t=${game_data.player.id}`;
    } else {
        fetchGroups =
            game_data.link_base_pure +
            'groups&mode=overview&ajax=load_group_menu';
    }
    const villageGroups = await jQuery
        .get(fetchGroups)
        .then((response) => response)
        .catch((error) => {
            UI.ErrorMessage('Error fetching village groups!');
            console.error(`${scriptInfo()} Error:`, error);
        });

    return villageGroups;
}

// Helper: Fetch World Unit Info
function fetchUnitInfo() {
    jQuery
        .ajax({
            url: '/interface.php?func=get_unit_info',
        })
        .done(function (response) {
            unitInfo = xml2json($(response));
            localStorage.setItem(
                `${LS_PREFIX}_unit_info`,
                JSON.stringify(unitInfo)
            );
            localStorage.setItem(
                `${LS_PREFIX}_last_updated`,
                Date.parse(new Date())
            );
        });
}

// Helper: Fetch home troop counts for current group
async function fetchTroopsForCurrentGroup(groupId) {
    const mobileCheck = jQuery('#mobileHeader').length > 0;
    const troopsForGroup = await jQuery
        .get(
            game_data.link_base_pure +
                `overview_villages&mode=combined&group=${groupId}&page=-1`
        )
        .then(async (response) => {
            const htmlDoc = jQuery.parseHTML(response);
            const homeTroops = [];

            if (mobileCheck) {
                let table = jQuery(htmlDoc).find('#combined_table tr.nowrap');
                for (let i = 0; i < table.length; i++) {
                    let objTroops = {};
                    let villageId = parseInt(
                        table[i]
                            .getElementsByClassName('quickedit-vn')[0]
                            .getAttribute('data-id')
                    );
                    let listTroops = Array.from(
                        table[i].getElementsByTagName('img')
                    )
                        .filter((e) => e.src.includes('unit'))
                        .map((e) => ({
                            name: e.src
                                .split('unit_')[1]
                                .replace('@2x.webp', ''),
                            value: parseInt(
                                e.parentElement.nextElementSibling.innerText
                            ),
                        }));
                    listTroops.forEach((item) => {
                        objTroops[item.name] = item.value;
                    });

                    objTroops.villageId = villageId;

                    homeTroops.push(objTroops);
                }
            } else {
                const combinedTableRows = jQuery(htmlDoc).find(
                    '#combined_table tr.nowrap'
                );
                const combinedTableHead = jQuery(htmlDoc).find(
                    '#combined_table tr:eq(0) th'
                );

                const combinedTableHeader = [];

                // collect possible buildings and troop types
                jQuery(combinedTableHead).each(function () {
                    const thImage = jQuery(this).find('img').attr('src');
                    if (thImage) {
                        let thImageFilename = thImage.split('/').pop();
                        thImageFilename = thImageFilename.replace('.webp', '');
                        combinedTableHeader.push(thImageFilename);
                    } else {
                        combinedTableHeader.push(null);
                    }
                });

                // collect possible troop types
                combinedTableRows.each(function () {
                    let rowTroops = {};

                    combinedTableHeader.forEach((tableHeader, index) => {
                        if (tableHeader) {
                            if (tableHeader.includes('unit_')) {
                                const villageId = jQuery(this)
                                    .find('td:eq(1) span.quickedit-vn')
                                    .attr('data-id');
                                const unitType = tableHeader.replace(
                                    'unit_',
                                    ''
                                );
                                rowTroops = {
                                    ...rowTroops,
                                    villageId: parseInt(villageId),
                                    [unitType]: parseInt(
                                        jQuery(this)
                                            .find(`td:eq(${index})`)
                                            .text()
                                    ),
                                };
                            }
                        }
                    });

                    homeTroops.push(rowTroops);
                });
            }

            return homeTroops;
        })
        .catch((error) => {
            UI.ErrorMessage(
                tt('An error occured while fetching troop counts!')
            );
            console.error(`${scriptInfo()} Error:`, error);
        });

    return troopsForGroup;
}

// Helper: Get landing time from a string that contains "today at" and "tomorrow at"
function getTimeFromString(timeLand) {
    let dateLand = '';
    let serverDate = document.getElementById('serverDate').innerText.split('/');

    let TIME_PATTERNS = {
        today: 'today at %s',
        tomorrow: 'tomorrow at %s',
        later: 'on %1 at %2',
    };

    if (window.lang) {
        TIME_PATTERNS = {
            today: window.lang['aea2b0aa9ae1534226518faaefffdaad'],
            tomorrow: window.lang['57d28d1b211fddbb7a499ead5bf23079'],
            later: window.lang['0cb274c906d622fa8ce524bcfbb7552d'],
        };
    }

    let todayPattern = new RegExp(
        TIME_PATTERNS.today.replace('%s', '([\\d+|:]+)')
    ).exec(timeLand);
    let tomorrowPattern = new RegExp(
        TIME_PATTERNS.tomorrow.replace('%s', '([\\d+|:]+)')
    ).exec(timeLand);
    let laterDatePattern = new RegExp(
        TIME_PATTERNS.later
            .replace('%1', '([\\d+|\\.]+)')
            .replace('%2', '([\\d+|:]+)')
    ).exec(timeLand);

    let time =
        timeLand.match(/\d+:\d+:\d+:\d+/) ?? timeLand.match(/\d+:\d+:\d+/);
    time = time && time[0];

    if (todayPattern !== null) {
        // today
        dateLand =
            serverDate[0] +
            '/' +
            serverDate[1] +
            '/' +
            serverDate[2] +
            ' ' +
            time;
    } else if (tomorrowPattern !== null) {
        // tomorrow
        let tomorrowDate = new Date(
            serverDate[1] + '/' + serverDate[0] + '/' + serverDate[2]
        );
        tomorrowDate.setDate(tomorrowDate.getDate() + 1);
        dateLand =
            ('0' + tomorrowDate.getDate()).slice(-2) +
            '/' +
            ('0' + (tomorrowDate.getMonth() + 1)).slice(-2) +
            '/' +
            tomorrowDate.getFullYear() +
            ' ' +
            time;
    } else {
        // on
        let on = timeLand.match(/\d+.\d+/)[0].split('.');
        dateLand = on[0] + '/' + on[1] + '/' + serverDate[2] + ' ' + time;
    }

    return dateLand;
}

// Helper: Format as number
function formatAsNumber(number) {
    return parseInt(number).toLocaleString('de');
}

// Helper: XML to JSON converter
var xml2json = function ($xml) {
    var data = {};
    $.each($xml.children(), function (i) {
        var $this = $(this);
        if ($this.children().length > 0) {
            data[$this.prop('tagName')] = xml2json($this);
        } else {
            data[$this.prop('tagName')] = $.trim($this.text());
        }
    });
    return data;
};

// Helper: Get parameter by name
function getParameterByName(name, url = window.location.href) {
    return new URL(url).searchParams.get(name);
}

// Helper: Generates script info
function scriptInfo() {
    return `[${scriptData.name} ${scriptData.version}]`;
}

// Helper: Prints universal debug information
function initDebug() {
    console.debug(`${scriptInfo()} It works ðŸš€!`);
    console.debug(`${scriptInfo()} HELP:`, scriptData.helpLink);
    if (DEBUG) {
        console.debug(`${scriptInfo()} Market:`, game_data.market);
        console.debug(`${scriptInfo()} World:`, game_data.world);
        console.debug(`${scriptInfo()} Screen:`, game_data.screen);
        console.debug(`${scriptInfo()} Game Version:`, game_data.majorVersion);
        console.debug(`${scriptInfo()} Game Build:`, game_data.version);
        console.debug(`${scriptInfo()} Locale:`, game_data.locale);
        console.debug(
            `${scriptInfo()} Premium:`,
            game_data.features.Premium.active
        );
    }
}

// Helper: Text Translator
function tt(string) {
    const gameLocale = game_data.locale;

    if (translations[gameLocale] !== undefined) {
        return translations[gameLocale][string];
    } else {
        return translations['en_DK'][string];
    }
}

async function countAPI() {
    await jQuery
        .ajax({
            url: 'https://twscripts.dev/count/',
            method: 'POST',
            data: {
                scriptData: scriptData,
                world: game_data.world,
                market: game_data.market,
                enableCountApi: true,
                referralScript:
                    'https://twscripts.dev/scripts/twSDK.js?url=https://twscripts.dev/scripts/singleVillageSnipe.js',
            },
            dataType: 'JSON',
        })
        .then(({ message }) => {
            if (message) {
                console.debug(
                    `${scriptInfo()} This script has been run ${formatAsNumber(
                        parseInt(message)
                    )} times.`
                );
            }
        });
}

// Initialize Script
(async function () {
    if (!game_data.features.Premium.active) {
        UI.ErrorMessage(tt('This script requires Premium Account!'));
        return;
    }

    const gameScreen = getParameterByName('screen');

    if (gameScreen === 'info_village') {
        try {
            initVillageSnipe(GROUP_ID);
            await countAPI();
        } catch (error) {
            UI.ErrorMessage(tt('There was an error!'));
            console.error(`${scriptInfo()} Error:`, error);
        }
    } else {
        UI.InfoMessage(
            tt('This script can only be run on a single village screen!')
        );
        setTimeout(function () {
            window.location.assign(
                game_data.link_base_pure +
                    'info_village&id=' +
                    game_data.village.id
            );
        }, 500);
    }
})();
