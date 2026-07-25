import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  Client,
  FieldServiceReport,
  CategoryOption,
  ServiceTypeOption,
  ContractOption,
  TechnicianRoleOption,
} from '../types';

const STORAGE_KEYS = {
  REPORTS: 'rexroth_fs_reports_v1',
  CLIENTS: 'rexroth_fs_clients_v1',
  CATEGORIES: 'rexroth_fs_categories_v1',
  SERVICE_TYPES: 'rexroth_fs_service_types_v1',
  CONTRACTS: 'rexroth_fs_contracts_v1',
  TECHNICIANS: 'rexroth_fs_technicians_v1',
  CONFIG: 'rexroth_fs_supabase_config',
};

// Initial default seed clients provided officially (376 clients from CSV)
export const INITIAL_CLIENTS: Client[] = [
  { id: 'cli-6001567', identificacion: '6001567', nombre: 'BOSCH REX', direccion: 'VANTAA' },
  { id: 'cli-6018968', identificacion: '6018968', nombre: 'BOSCH REX', direccion: 'LOHR A MAIN' },
  { id: 'cli-6020823', identificacion: '6020823', nombre: 'BOSCH REX', direccion: 'WARSZAWA' },
  { id: 'cli-6020945', identificacion: '6020945', nombre: 'BOSCH REX', direccion: 'CUAUTITLAN IZCALLI' },
  { id: 'cli-6020966', identificacion: '6020966', nombre: 'BOSCH CANA', direccion: 'WELLAND' },
  { id: 'cli-6051475', identificacion: '6051475', nombre: 'MIGUELNARD', direccion: 'BUENOS AIRES' },
  { id: 'cli-6055145', identificacion: '6055145', nombre: 'ACCINSASA', direccion: 'BUENOS AIRES' },
  { id: 'cli-6061706', identificacion: '6061706', nombre: 'BOSCH REX', direccion: 'GROVE CITY' },
  { id: 'cli-6097206', identificacion: '6097206', nombre: 'ABRINCO', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097207', identificacion: '6097207', nombre: 'ACERBRAG', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097208', identificacion: '6097208', nombre: 'ACINDAR', direccion: 'VILLA MERCEDES' },
  { id: 'cli-6097209', identificacion: '6097209', nombre: 'ACIS MAQ&M', direccion: 'SAN JUSTO' },
  { id: 'cli-6097211', identificacion: '6097211', nombre: 'ADK', direccion: 'BELL VILLE' },
  { id: 'cli-6097213', identificacion: '6097213', nombre: 'AGCO ARGEN', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097214', identificacion: '6097214', nombre: 'AGRALE ARG', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097215', identificacion: '6097215', nombre: 'AGRICOLA A', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097216', identificacion: '6097216', nombre: 'AGROMETAL', direccion: 'CORDOBA' },
  { id: 'cli-6097217', identificacion: '6097217', nombre: 'AKAPOL', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097218', identificacion: '6097218', nombre: 'ALERCIA HN', direccion: 'CORDOBA' },
  { id: 'cli-6097220', identificacion: '6097220', nombre: 'ALIPACK', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097224', identificacion: '6097224', nombre: 'ALTA TECNO', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097225', identificacion: '6097225', nombre: 'ALUAR', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097226', identificacion: '6097226', nombre: 'AMMATURO', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097227', identificacion: '6097227', nombre: 'ANDINA EMP', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097228', identificacion: '6097228', nombre: 'ANEKO', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097229', identificacion: '6097229', nombre: 'ARAUCO ARG', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097230', identificacion: '6097230', nombre: 'ARCOR SAIC', direccion: 'CORDOBA' },
  { id: 'cli-6097231', identificacion: '6097231', nombre: 'ARGENDRILL', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097232', identificacion: '6097232', nombre: 'ARMANDO TE', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097233', identificacion: '6097233', nombre: 'ARODAMIENT', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097234', identificacion: '6097234', nombre: 'ARUNCO IND', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097235', identificacion: '6097235', nombre: 'ATI EQUIPA', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097236', identificacion: '6097236', nombre: 'AUTOMATISM', direccion: 'TIERRA DEL FUEGO' },
  { id: 'cli-6097237', identificacion: '6097237', nombre: 'AVEX', direccion: 'CORDOBA' },
  { id: 'cli-6097238', identificacion: '6097238', nombre: 'BAGLEY ARG', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097239', identificacion: '6097239', nombre: 'BARTOLUCCI', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097242', identificacion: '6097242', nombre: 'BILPA', direccion: 'URUGUAY' },
  { id: 'cli-6097243', identificacion: '6097243', nombre: 'BIPRESS', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097244', identificacion: '6097244', nombre: 'BLANCO ROD', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097245', identificacion: '6097245', nombre: 'BLIPACK', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097246', identificacion: '6097246', nombre: 'BREMBO ARG', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097247', identificacion: '6097247', nombre: 'BRIDGESTON', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097248', identificacion: '6097248', nombre: 'FLUITRÓNIC', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097250', identificacion: '6097250', nombre: 'CABELMA', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097251', identificacion: '6097251', nombre: 'CALFRAC WE', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097253', identificacion: '6097253', nombre: 'CARTOCOR', direccion: 'ARROYITO' },
  { id: 'cli-6097255', identificacion: '6097255', nombre: 'CEMENTOS A', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097256', identificacion: '6097256', nombre: 'CERRO VANG', direccion: 'SANTA CRUZ' },
  { id: 'cli-6097258', identificacion: '6097258', nombre: 'CIBIE ARGE', direccion: 'CORDOBA' },
  { id: 'cli-6097259', identificacion: '6097259', nombre: 'CINTOLO HN', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097260', identificacion: '6097260', nombre: 'CLAPP ARGE', direccion: 'ENTRE RIOS' },
  { id: 'cli-6097261', identificacion: '6097261', nombre: 'CMZ', direccion: 'LAS VARILLAS' },
  { id: 'cli-6097262', identificacion: '6097262', nombre: 'COCA COLA', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097263', identificacion: '6097263', nombre: 'COMPANIA', direccion: 'MENDOZA' },
  { id: 'cli-6097266', identificacion: '6097266', nombre: 'CRAMSA', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097267', identificacion: '6097267', nombre: 'CUTER ROBO', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097268', identificacion: '6097268', nombre: 'DATAWAVES', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097269', identificacion: '6097269', nombre: 'DBD ING SO', direccion: 'CAMPANA' },
  { id: 'cli-6097271', identificacion: '6097271', nombre: 'DENSO MANU', direccion: 'CORDOBA' },
  { id: 'cli-6097273', identificacion: '6097273', nombre: 'DISTRIBUID', direccion: 'CORDOBA' },
  { id: 'cli-6097274', identificacion: '6097274', nombre: 'ECO MINERA', direccion: 'SAN JUAN' },
  { id: 'cli-6097277', identificacion: '6097277', nombre: 'EGGER ARGE', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097278', identificacion: '6097278', nombre: 'EMERSON AR', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097279', identificacion: '6097279', nombre: 'ENERGIA PR', direccion: 'SAN JUAN' },
  { id: 'cli-6097281', identificacion: '6097281', nombre: 'YACYRETA', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097283', identificacion: '6097283', nombre: 'ESCORIAL', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097286', identificacion: '6097286', nombre: 'EXPLOS TEC', direccion: 'PILAR, BUENOS AIRES' },
  { id: 'cli-6097287', identificacion: '6097287', nombre: 'FABRIMATIC', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097288', identificacion: '6097288', nombre: 'FADICAD', direccion: 'CORDOBA' },
  { id: 'cli-6097290', identificacion: '6097290', nombre: 'FAM-MA AUT', direccion: 'CORDOBA' },
  { id: 'cli-6097291', identificacion: '6097291', nombre: 'FATE', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097293', identificacion: '6097293', nombre: 'FAVOT', direccion: 'SANTA FE' },
  { id: 'cli-6097294', identificacion: '6097294', nombre: 'FCA AUTO', direccion: 'CORDOBA' },
  { id: 'cli-6097296', identificacion: '6097296', nombre: 'FERRERO AR', direccion: 'ENTRE RIOS' },
  { id: 'cli-6097297', identificacion: '6097297', nombre: 'FERROSIDER', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097298', identificacion: '6097298', nombre: 'FERTIL TEC', direccion: 'CORDOBA' },
  { id: 'cli-6097302', identificacion: '6097302', nombre: 'FOR TAPEBI', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097303', identificacion: '6097303', nombre: 'FRIPACK', direccion: 'CORDOBA' },
  { id: 'cli-6097304', identificacion: '6097304', nombre: 'AUME', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097305', identificacion: '6097305', nombre: 'FUSTEC', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097306', identificacion: '6097306', nombre: 'FV', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097308', identificacion: '6097308', nombre: 'GENERAL MO', direccion: 'SANTA FE' },
  { id: 'cli-6097309', identificacion: '6097309', nombre: 'GESTAMP BA', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097310', identificacion: '6097310', nombre: 'GIOVAGNOLI', direccion: 'SANTA FE' },
  { id: 'cli-6097311', identificacion: '6097311', nombre: 'GLACIAR PE', direccion: 'MAR DEL PLATA' },
  { id: 'cli-6097312', identificacion: '6097312', nombre: 'GLOBE', direccion: 'MENDOZA' },
  { id: 'cli-6097313', identificacion: '6097313', nombre: 'GONVARRI A', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097316', identificacion: '6097316', nombre: 'GRUPO COLO', direccion: 'SALTA' },
  { id: 'cli-6097317', identificacion: '6097317', nombre: 'GRUPO EQUI', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097318', identificacion: '6097318', nombre: 'HAMMERLY V', direccion: 'SANTA FE' },
  { id: 'cli-6097319', identificacion: '6097319', nombre: 'HIDRAULICA', direccion: 'CORDOBA' },
  { id: 'cli-6097321', identificacion: '6097321', nombre: 'HIDR TECN', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097322', identificacion: '6097322', nombre: 'HIDROTEC', direccion: 'SALTA' },
  { id: 'cli-6097323', identificacion: '6097323', nombre: 'HOLCIM', direccion: 'MALAGUEÑO' },
  { id: 'cli-6097324', identificacion: '6097324', nombre: 'HONDA MOTO', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097325', identificacion: '6097325', nombre: 'HYDAC TECH', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097326', identificacion: '6097326', nombre: 'HYDRAIR', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097327', identificacion: '6097327', nombre: 'HYDRO EXTR', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097328', identificacion: '6097328', nombre: 'IEMAT', direccion: 'CORDOBA' },
  { id: 'cli-6097329', identificacion: '6097329', nombre: 'IGARRETA M', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097330', identificacion: '6097330', nombre: 'IGUAZU ARG', direccion: 'MISIONES' },
  { id: 'cli-6097332', identificacion: '6097332', nombre: 'IMA MAI', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097333', identificacion: '6097333', nombre: 'IND.MET.PE', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097335', identificacion: '6097335', nombre: 'IND J MACI', direccion: 'SAN FRANCISCO' },
  { id: 'cli-6097336', identificacion: '6097336', nombre: 'INDUSTRIAS', direccion: 'SANTA FE' },
  { id: 'cli-6097338', identificacion: '6097338', nombre: 'INFAS', direccion: 'CORDOBA' },
  { id: 'cli-6097339', identificacion: '6097339', nombre: 'INGENIERIA', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097340', identificacion: '6097340', nombre: 'INGELSUD', direccion: 'SAN CARLOS DE BARILOCHE' },
  { id: 'cli-6097341', identificacion: '6097341', nombre: 'INGENIERIA', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097343', identificacion: '6097343', nombre: 'INSOLIND', direccion: 'CORDOBA' },
  { id: 'cli-6097344', identificacion: '6097344', nombre: 'INVAP', direccion: 'RIO NEGRO' },
  { id: 'cli-6097347', identificacion: '6097347', nombre: 'IVECO', direccion: 'CORDOBA' },
  { id: 'cli-6097348', identificacion: '6097348', nombre: 'JOSE ITURR', direccion: 'SANTA FE' },
  { id: 'cli-6097349', identificacion: '6097349', nombre: 'DREAN', direccion: 'LUQUE' },
  { id: 'cli-6097355', identificacion: '6097355', nombre: 'SOFTYS', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097356', identificacion: '6097356', nombre: 'LAGGER Y P', direccion: 'SANTA FE' },
  { id: 'cli-6097357', identificacion: '6097357', nombre: 'L\'EQUIPE', direccion: 'CORDOBA' },
  { id: 'cli-6097359', identificacion: '6097359', nombre: 'LINEARTEC', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097361', identificacion: '6097361', nombre: 'LLORENTE', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097363', identificacion: '6097363', nombre: 'LOMA NEGRA', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097364', identificacion: '6097364', nombre: 'OLIVARES V', direccion: 'SANTA FE' },
  { id: 'cli-6097366', identificacion: '6097366', nombre: 'M A COCCHI', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097368', identificacion: '6097368', nombre: 'MANUEL SAN', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097370', identificacion: '6097370', nombre: 'MAQUINAS A', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097371', identificacion: '6097371', nombre: 'MAXION MON', direccion: 'CORDOBA' },
  { id: 'cli-6097373', identificacion: '6097373', nombre: 'ME-PROMAES', direccion: 'CORDOBA' },
  { id: 'cli-6097375', identificacion: '6097375', nombre: 'METALES DE', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097376', identificacion: '6097376', nombre: 'METALFOR', direccion: 'CORDOBA' },
  { id: 'cli-6097377', identificacion: '6097377', nombre: 'METALMECAN', direccion: 'VILLA MERCEDES' },
  { id: 'cli-6097378', identificacion: '6097378', nombre: 'METALSA AR', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097379', identificacion: '6097379', nombre: 'METALURGIC', direccion: 'CORDOBA' },
  { id: 'cli-6097382', identificacion: '6097382', nombre: 'MIGNANI', direccion: 'SANTA FE' },
  { id: 'cli-6097383', identificacion: '6097383', nombre: 'MINA PIRQU', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097384', identificacion: '6097384', nombre: 'MINAS ARGE', direccion: 'SAN JUAN' },
  { id: 'cli-6097385', identificacion: '6097385', nombre: 'MINERA AND', direccion: 'SAN JUAN' },
  { id: 'cli-6097386', identificacion: '6097386', nombre: 'MINERA DON', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097387', identificacion: '6097387', nombre: 'MINERA SAN', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097390', identificacion: '6097390', nombre: 'MOLINO CAN', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097392', identificacion: '6097392', nombre: 'MONDELEZ A', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097393', identificacion: '6097393', nombre: 'MONSANTO A', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097395', identificacion: '6097395', nombre: 'MOTO MECAN', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097396', identificacion: '6097396', nombre: 'MOVIMIENTO', direccion: 'SANTA FE' },
  { id: 'cli-6097398', identificacion: '6097398', nombre: 'MSF TECH', direccion: 'SAN FRANCISCO' },
  { id: 'cli-6097399', identificacion: '6097399', nombre: 'MUSIAN CAN', direccion: 'MARCOS JUAREZ' },
  { id: 'cli-6097401', identificacion: '6097401', nombre: 'NESTLE ARG', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097402', identificacion: '6097402', nombre: 'NEWCO', direccion: 'TUCUMAN' },
  { id: 'cli-6097404', identificacion: '6097404', nombre: 'NOVAGRAF', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097405', identificacion: '6097405', nombre: 'OBATOWN CO', direccion: 'SGO. DEL ESTERO' },
  { id: 'cli-6097409', identificacion: '6097409', nombre: 'PABSA', direccion: 'CORDOBA' },
  { id: 'cli-6097410', identificacion: '6097410', nombre: 'PAPEL MISI', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097412', identificacion: '6097412', nombre: 'PAPELERA S', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097413', identificacion: '6097413', nombre: 'PAPELERA S', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097414', identificacion: '6097414', nombre: 'PAUNY', direccion: 'CORDOBA' },
  { id: 'cli-6097415', identificacion: '6097415', nombre: 'PETRENIUK', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097416', identificacion: '6097416', nombre: 'PETROQU CO', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097417', identificacion: '6097417', nombre: 'PEUGEOT CI', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097418', identificacion: '6097418', nombre: 'PIERO SAIC', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097419', identificacion: '6097419', nombre: 'PIRELLI NE', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097420', identificacion: '6097420', nombre: 'PLA S.A.', direccion: 'CORDOBA' },
  { id: 'cli-6097421', identificacion: '6097421', nombre: 'PLASTIC OM', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097423', identificacion: '6097423', nombre: 'PLASTICOS', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097425', identificacion: '6097425', nombre: 'PRENSAS SC', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097426', identificacion: '6097426', nombre: 'PRIMO Y CI', direccion: 'SANTA FE' },
  { id: 'cli-6097427', identificacion: '6097427', nombre: 'PROCTER &', direccion: 'SAN LUIS' },
  { id: 'cli-6097428', identificacion: '6097428', nombre: 'PRODISMO', direccion: 'CORDOBA' },
  { id: 'cli-6097430', identificacion: '6097430', nombre: 'RASKIN HER', direccion: 'CHUBUT' },
  { id: 'cli-6097432', identificacion: '6097432', nombre: 'RODAMIENTO', direccion: 'CORDOBA' },
  { id: 'cli-6097433', identificacion: '6097433', nombre: 'ROD PALOMA', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097434', identificacion: '6097434', nombre: 'RODAMIENTO', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097435', identificacion: '6097435', nombre: 'RODASER RO', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097436', identificacion: '6097436', nombre: 'ROLLER SER', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097437', identificacion: '6097437', nombre: 'ROLOP', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097438', identificacion: '6097438', nombre: 'ROMAN Y MA', direccion: 'SANTA FE' },
  { id: 'cli-6097440', identificacion: '6097440', nombre: 'RUBEN COST', direccion: 'SAN FRANCISCO' },
  { id: 'cli-6097441', identificacion: '6097441', nombre: 'RULEMANES', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097443', identificacion: '6097443', nombre: 'RULEMANES', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097446', identificacion: '6097446', nombre: 'SABAVISA', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097450', identificacion: '6097450', nombre: 'SCANIA ARG', direccion: 'CRUZ ALTA' },
  { id: 'cli-6097451', identificacion: '6097451', nombre: 'SCRAPSERVI', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097452', identificacion: '6097452', nombre: 'SEABOARD', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097453', identificacion: '6097453', nombre: 'SIAT', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097455', identificacion: '6097455', nombre: 'SIEMBRA NE', direccion: 'SANTA FE' },
  { id: 'cli-6097456', identificacion: '6097456', nombre: 'SIEMENS', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097458', identificacion: '6097458', nombre: 'SIPAR ACER', direccion: 'SANTA FE' },
  { id: 'cli-6097459', identificacion: '6097459', nombre: 'SKF ARGENT', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097460', identificacion: '6097460', nombre: 'SOGEFI SUS', direccion: 'CORDOBA' },
  { id: 'cli-6097461', identificacion: '6097461', nombre: 'SOLUCIONES', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097463', identificacion: '6097463', nombre: 'STARA ARGE', direccion: 'SANTA FE' },
  { id: 'cli-6097464', identificacion: '6097464', nombre: 'STICKFORTH', direccion: 'CORDOBA' },
  { id: 'cli-6097468', identificacion: '6097468', nombre: 'TEKNIX', direccion: 'CORDOBA' },
  { id: 'cli-6097470', identificacion: '6097470', nombre: 'TERMINAL Z', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097472', identificacion: '6097472', nombre: 'TERNIUM AR', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097474', identificacion: '6097474', nombre: 'TOYOTA ARG', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097475', identificacion: '6097475', nombre: 'TRANS GAS', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097477', identificacion: '6097477', nombre: 'UGA SEISMI', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097478', identificacion: '6097478', nombre: 'UNILEVER', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097480', identificacion: '6097480', nombre: 'UPM', direccion: 'URUGUAY' },
  { id: 'cli-6097481', identificacion: '6097481', nombre: 'VALLE DE L', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097482', identificacion: '6097482', nombre: 'VASSALLI F', direccion: 'SANTA FE' },
  { id: 'cli-6097483', identificacion: '6097483', nombre: 'VENVER', direccion: 'CHUBUT' },
  { id: 'cli-6097485', identificacion: '6097485', nombre: 'VOITH PAPE', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097486', identificacion: '6097486', nombre: 'WYNKA', direccion: 'BUENOS AIRES' },
  { id: 'cli-6097488', identificacion: '6097488', nombre: 'ZF ARGENTI', direccion: 'SAN FRANCISCO' },
  { id: 'cli-6097489', identificacion: '6097489', nombre: 'ZUCAMOR', direccion: 'BUENOS AIRES' },
  { id: 'cli-6103383', identificacion: '6103383', nombre: 'BOSCH REX', direccion: 'CERNUSCO SUL NAVIGLIO' },
  { id: 'cli-6103663', identificacion: '6103663', nombre: 'BOSCH REX', direccion: 'BETHLEHEM' },
  { id: 'cli-6103730', identificacion: '6103730', nombre: 'BOSCH REX', direccion: 'CARAPACHAY, BUENOS AIRES' },
  { id: 'cli-6113843', identificacion: '6113843', nombre: 'SIDERCA', direccion: 'BUENOS AIRES' },
  { id: 'cli-6119854', identificacion: '6119854', nombre: 'BOSCH REX', direccion: 'POMERODE' },
  { id: 'cli-6145730', identificacion: '6145730', nombre: 'BERTOTTO', direccion: 'WANDA' },
  { id: 'cli-6148151', identificacion: '6148151', nombre: 'TOTAL AUST', direccion: 'BUENOS AIRES' },
  { id: 'cli-6180686', identificacion: '6180686', nombre: 'BOSCH', direccion: 'BUENOS AIRES' },
  { id: 'cli-6202477', identificacion: '6202477', nombre: 'NAKASE', direccion: 'BUENOS AIRES' },
  { id: 'cli-6238637', identificacion: '6238637', nombre: 'LEDESMA', direccion: 'BUENOS AIRES' },
  { id: 'cli-6302250', identificacion: '6302250', nombre: 'FORD ARGEN', direccion: 'BUENOS AIRES' },
  { id: 'cli-6433424', identificacion: '6433424', nombre: 'VW ARGENTI', direccion: 'BUENOS AIRES' },
  { id: 'cli-6435749', identificacion: '6435749', nombre: 'MERCEDES B', direccion: 'VIRREY DEL PINO' },
  { id: 'cli-6460068', identificacion: '6460068', nombre: 'MIVIN ENGG', direccion: 'BANGALORE' },
  { id: 'cli-6501506', identificacion: '6501506', nombre: 'RBCODC', direccion: 'BOGOTA' },
  { id: 'cli-6506837', identificacion: '6506837', nombre: 'BOSCH REX', direccion: 'MELLANSEL' },
  { id: 'cli-6520578', identificacion: '6520578', nombre: 'RENAULT AR', direccion: 'CORDOBA' },
  { id: 'cli-6525513', identificacion: '6525513', nombre: 'GESTAMP CO', direccion: 'CORDOBA' },
  { id: 'cli-6535662', identificacion: '6535662', nombre: 'FONG', direccion: 'TAINAN CITY' },
  { id: 'cli-6600347', identificacion: '6600347', nombre: 'BOSCH REXR', direccion: 'HO CHI MINH CITY' },
  { id: 'cli-6614140', identificacion: '6614140', nombre: 'AVENTICS', direccion: 'LINZ' },
  { id: 'cli-6616041', identificacion: '6616041', nombre: 'BOSCH REX', direccion: 'CALLAO' },
  { id: 'cli-6618361', identificacion: '6618361', nombre: 'CNH', direccion: 'CAPITAL FEDERAL' },
  { id: 'cli-6626818', identificacion: '6626818', nombre: 'TECNOMAMA', direccion: 'ROMENTINO' },
  { id: 'cli-6630445', identificacion: '6630445', nombre: 'OROPLATA', direccion: 'BUENOS AIRES' },
  { id: 'cli-6633860', identificacion: '6633860', nombre: 'BOSCH REX', direccion: 'RAYONG' },
  { id: 'cli-6642993', identificacion: '6642993', nombre: 'BOSCH REX', direccion: 'SANTIAGO' },
  { id: 'cli-6644206', identificacion: '6644206', nombre: 'BOSCHREX P', direccion: 'CERNUSCO SUL NAVIGLIO' },
  { id: 'cli-6673472', identificacion: '6673472', nombre: 'BOSCH REXR', direccion: 'CUAUTITLAN IZCALLI' },
  { id: 'cli-6684089', identificacion: '6684089', nombre: 'ESTELAR RE', direccion: 'BUENOS AIRES' },
  { id: 'cli-6690429', identificacion: '6690429', nombre: 'BOSCH REX', direccion: 'ITATIBA' },
  { id: 'cli-6696364', identificacion: '6696364', nombre: 'ANDRITZ', direccion: 'FRAY BENTOS' },
  { id: 'cli-6696555', identificacion: '6696555', nombre: 'UPM', direccion: 'FRAY BENTOS, RIO NEGRO' },
  { id: 'cli-6711479', identificacion: '6711479', nombre: 'ANDRITZ', direccion: 'COLONIA' },
  { id: 'cli-6727480', identificacion: '6727480', nombre: 'ALLONDA AM', direccion: 'ROQUE PEREZ' },
  { id: 'cli-6727481', identificacion: '6727481', nombre: 'ARAG ARGEN', direccion: 'ROSARIO' },
  { id: 'cli-6727482', identificacion: '6727482', nombre: 'CAIMAN', direccion: 'LAS PAREJAS' },
  { id: 'cli-6727483', identificacion: '6727483', nombre: 'COMETTO', direccion: 'TORTUGUITAS' },
  { id: 'cli-6727484', identificacion: '6727484', nombre: 'CONUAR', direccion: 'EZEIZA' },
  { id: 'cli-6727486', identificacion: '6727486', nombre: 'GHERBEZZA', direccion: 'ROSARIO' },
  { id: 'cli-6727487', identificacion: '6727487', nombre: 'HALLIBURTO', direccion: 'NEUQUÉN' },
  { id: 'cli-6727490', identificacion: '6727490', nombre: 'PAMPA ENER', direccion: 'BUENOS AIRES' },
  { id: 'cli-6727512', identificacion: '6727512', nombre: 'ACEITERA G', direccion: 'GENERAL DEHEZA' },
  { id: 'cli-6728376', identificacion: '6728376', nombre: 'RASCON', direccion: 'CASTELAR' },
  { id: 'cli-6728377', identificacion: '6728377', nombre: 'ACINDAR', direccion: 'VILLA CONSTITUCION' },
  { id: 'cli-6728378', identificacion: '6728378', nombre: 'GODOY', direccion: 'RECONQUISTA' },
  { id: 'cli-6728379', identificacion: '6728379', nombre: 'HOLCIM', direccion: 'OLAVARRÍA' },
  { id: 'cli-6728381', identificacion: '6728381', nombre: 'UNILEVER', direccion: 'TORTUGUITAS' },
  { id: 'cli-6728383', identificacion: '6728383', nombre: 'MERCEDES', direccion: 'VIRREY DEL PINO' },
  { id: 'cli-6728384', identificacion: '6728384', nombre: 'ARCOR', direccion: 'ARROYITO' },
  { id: 'cli-6728385', identificacion: '6728385', nombre: 'RODBALL', direccion: 'SAN MARTIN' },
  { id: 'cli-6728386', identificacion: '6728386', nombre: 'TECMAR.', direccion: 'MAR DEL PLATA' },
  { id: 'cli-6728388', identificacion: '6728388', nombre: 'GIORGI', direccion: 'FUENTES' },
  { id: 'cli-6728389', identificacion: '6728389', nombre: 'RODAPAL', direccion: 'MONTE GRANDE' },
  { id: 'cli-6728390', identificacion: '6728390', nombre: 'ALTIPLANO', direccion: 'SALTA' },
  { id: 'cli-6728392', identificacion: '6728392', nombre: 'SIMAT', direccion: 'BUENOS AIRES' },
  { id: 'cli-6728393', identificacion: '6728393', nombre: 'INFA', direccion: 'PUERTO MADRYN' },
  { id: 'cli-6728394', identificacion: '6728394', nombre: 'APM', direccion: 'BUENOS AIRES' },
  { id: 'cli-6728395', identificacion: '6728395', nombre: 'OLEOHIDRAU', direccion: 'ARMSTRONG' },
  { id: 'cli-6728396', identificacion: '6728396', nombre: 'TECEM', direccion: 'VILLA FORTABAT' },
  { id: 'cli-6728485', identificacion: '6728485', nombre: 'TERNIUM', direccion: 'HAEDO' },
  { id: 'cli-6728486', identificacion: '6728486', nombre: 'TERNIUM', direccion: 'CANNING' },
  { id: 'cli-6728487', identificacion: '6728487', nombre: 'VOLKSWAGEN', direccion: 'CORDOBA' },
  { id: 'cli-6728488', identificacion: '6728488', nombre: 'LOMA NEGRA', direccion: 'BUENOS AIRES' },
  { id: 'cli-6728490', identificacion: '6728490', nombre: 'ACINDAR', direccion: 'SAN LUIS' },
  { id: 'cli-6728491', identificacion: '6728491', nombre: 'ACINDAR', direccion: 'LA TABLADA' },
  { id: 'cli-6728492', identificacion: '6728492', nombre: 'ACINDAR', direccion: 'ROSARIO' },
  { id: 'cli-6728493', identificacion: '6728493', nombre: 'ACINDAR', direccion: 'VILLA MERCEDES' },
  { id: 'cli-6728494', identificacion: '6728494', nombre: 'ALUAR', direccion: 'ABASTO' },
  { id: 'cli-6728756', identificacion: '6728756', nombre: 'CELULOSA', direccion: 'CONCHILLAS' },
  { id: 'cli-6728758', identificacion: '6728758', nombre: 'BOMBAS', direccion: 'MONTEVIDEO' },
  { id: 'cli-6729248', identificacion: '6729248', nombre: 'AES ARGENT', direccion: 'SAN NICOLÁS DE LOS ARROYO' },
  { id: 'cli-6729252', identificacion: '6729252', nombre: 'PELME', direccion: 'SAN MARTIN' },
  { id: 'cli-6729254', identificacion: '6729254', nombre: 'NIZA', direccion: 'VILLA MERCEDES' },
  { id: 'cli-6729436', identificacion: '6729436', nombre: 'Y.P.F.', direccion: 'EL BRACHO' },
  { id: 'cli-6729438', identificacion: '6729438', nombre: 'MACIZO', direccion: 'RIO GALLEGOS' },
  { id: 'cli-6729439', identificacion: '6729439', nombre: 'ALUMINIUM', direccion: 'FLORENCIO VARELA' },
  { id: 'cli-6729788', identificacion: '6729788', nombre: 'MOLTECH', direccion: 'CABA' },
  { id: 'cli-6729790', identificacion: '6729790', nombre: 'TECSESI', direccion: 'BUENOS AIRES' },
  { id: 'cli-6729793', identificacion: '6729793', nombre: 'CMP ESTRUC', direccion: 'CAMPANA' },
  { id: 'cli-6729794', identificacion: '6729794', nombre: 'TAMBUL', direccion: 'POMAN' },
  { id: 'cli-6729795', identificacion: '6729795', nombre: 'TERMOANDES', direccion: 'SAN NICOLÁS DE LOS ARROYO' },
  { id: 'cli-6729800', identificacion: '6729800', nombre: 'STARTEC', direccion: 'PABLO PODESTA' },
  { id: 'cli-6729801', identificacion: '6729801', nombre: 'ALBANO', direccion: 'LA PLATA' },
  { id: 'cli-6729830', identificacion: '6729830', nombre: 'SAN ANTONI', direccion: 'RINCON DE LOS SAUCES' },
  { id: 'cli-6729831', identificacion: '6729831', nombre: 'CONSULTATI', direccion: 'BUENOS AIRES' },
  { id: 'cli-6729833', identificacion: '6729833', nombre: 'TYROLIT', direccion: 'CABA' },
  { id: 'cli-6730581', identificacion: '6730581', nombre: 'MONTAJES', direccion: 'MAR DEL PLATA' },
  { id: 'cli-6730582', identificacion: '6730582', nombre: 'MANSFIELD', direccion: 'SALTA' },
  { id: 'cli-6730585', identificacion: '6730585', nombre: 'SCHMIDT', direccion: 'LOMA HERMOSA' },
  { id: 'cli-6730586', identificacion: '6730586', nombre: 'VASSALLI', direccion: 'FIRMAT' },
  { id: 'cli-6730587', identificacion: '6730587', nombre: 'LUBRICAR A', direccion: 'ZARATE' },
  { id: 'cli-6730588', identificacion: '6730588', nombre: 'MJP SRL', direccion: 'MARCOS JUAREZ' },
  { id: 'cli-6730594', identificacion: '6730594', nombre: 'CONSTRUCTO', direccion: 'CAPITAL FEDERAL' },
  { id: 'cli-6730597', identificacion: '6730597', nombre: 'JOTACEROD', direccion: 'SAN ANDRES' },
  { id: 'cli-6730784', identificacion: '6730784', nombre: 'EMERSON', direccion: 'MONTEVIDEO' },
  { id: 'cli-6730785', identificacion: '6730785', nombre: 'CRRC', direccion: 'TAIYUAN' },
  { id: 'cli-6730894', identificacion: '6730894', nombre: 'FLAIR', direccion: 'GENERAL RODRIGUEZ' },
  { id: 'cli-6730928', identificacion: '6730928', nombre: 'RODAMIENTO', direccion: 'PILAR' },
  { id: 'cli-6730929', identificacion: '6730929', nombre: 'BERGOLO', direccion: 'SAN ANDRES' },
  { id: 'cli-6731547', identificacion: '6731547', nombre: 'PRC INGENI', direccion: 'SAN ANDRES' },
  { id: 'cli-6731548', identificacion: '6731548', nombre: 'PEINADURIA', direccion: 'TRELEW' },
  { id: 'cli-6731549', identificacion: '6731549', nombre: 'AFG', direccion: 'ROSARIO' },
  { id: 'cli-6732191', identificacion: '6732191', nombre: 'AGCO', direccion: 'HAEDO' },
  { id: 'cli-6732192', identificacion: '6732192', nombre: 'COMPAÑIA', direccion: 'GUEMES' },
  { id: 'cli-6732211', identificacion: '6732211', nombre: 'ENRIQUE', direccion: 'ESQUINA' },
  { id: 'cli-6732212', identificacion: '6732212', nombre: 'ENTIDAD', direccion: 'ITUZAINGO' },
  { id: 'cli-6732213', identificacion: '6732213', nombre: 'FORESTADOR', direccion: 'GOB. VIRASORO' },
  { id: 'cli-6732214', identificacion: '6732214', nombre: 'IGUAZU', direccion: 'PUERTO IGUAZU' },
  { id: 'cli-6732215', identificacion: '6732215', nombre: 'DREAN', direccion: 'RIO SEGUNDO' },
  { id: 'cli-6732216', identificacion: '6732216', nombre: 'COMPAÑIA', direccion: 'CAPITAL' },
  { id: 'cli-6732217', identificacion: '6732217', nombre: 'LEDESMA', direccion: 'LIBERTADOR GRAL.SAN MARTI' },
  { id: 'cli-6732218', identificacion: '6732218', nombre: 'LOMA', direccion: 'OLAVARRIA' },
  { id: 'cli-6732219', identificacion: '6732219', nombre: 'LOMA', direccion: 'ZAPALA' },
  { id: 'cli-6732220', identificacion: '6732220', nombre: 'LOMA', direccion: 'SIERRAS BAYAS' },
  { id: 'cli-6732221', identificacion: '6732221', nombre: 'LOMA', direccion: 'OLAVARRIA' },
  { id: 'cli-6732222', identificacion: '6732222', nombre: 'LOMA', direccion: 'OLAVARRIA' },
  { id: 'cli-6732223', identificacion: '6732223', nombre: 'LOMA', direccion: 'RAMALLO' },
  { id: 'cli-6732224', identificacion: '6732224', nombre: 'LLORENTE', direccion: 'OLAVARRIA' },
  { id: 'cli-6732225', identificacion: '6732225', nombre: 'FORD', direccion: 'BENAVIDES' },
  { id: 'cli-6732226', identificacion: '6732226', nombre: 'METALSA', direccion: 'PACHECO' },
  { id: 'cli-6732227', identificacion: '6732227', nombre: 'COMPAÑIA', direccion: 'PACHECO' },
  { id: 'cli-6732228', identificacion: '6732228', nombre: 'CEMENTOS', direccion: 'OLAVARRIA' },
  { id: 'cli-6732229', identificacion: '6732229', nombre: 'EGGER', direccion: 'CONCORDIA' },
  { id: 'cli-6732230', identificacion: '6732230', nombre: 'MICRON', direccion: 'GONZALEZ CATAN' },
  { id: 'cli-6732231', identificacion: '6732231', nombre: 'FERROSIDER', direccion: 'TORTUGUITAS' },
  { id: 'cli-6732232', identificacion: '6732232', nombre: 'MICRON', direccion: 'ENSENADA' },
  { id: 'cli-6732328', identificacion: '6732328', nombre: 'NOVOBRA', direccion: 'CUIDAD AUTONOMA DE BS AS' },
  { id: 'cli-6732365', identificacion: '6732365', nombre: 'MINA', direccion: 'RINCONADA' },
  { id: 'cli-6732366', identificacion: '6732366', nombre: 'PETROQUIMI', direccion: 'PICO TRUNCADO' },
  { id: 'cli-6732367', identificacion: '6732367', nombre: 'PAPEL', direccion: 'SAN PEDRO' },
  { id: 'cli-6732368', identificacion: '6732368', nombre: 'PAPEL', direccion: 'CAPIOVI' },
  { id: 'cli-6732369', identificacion: '6732369', nombre: 'NESTLE', direccion: 'MAGDALENA' },
  { id: 'cli-6732370', identificacion: '6732370', nombre: 'MONTAJES', direccion: 'MAR DEL PLATA' },
  { id: 'cli-6732371', identificacion: '6732371', nombre: 'COMPAÑIA', direccion: 'LUJAN DE CUYO' },
  { id: 'cli-6732372', identificacion: '6732372', nombre: 'ALUAR', direccion: 'EL TALAR' },
  { id: 'cli-6732442', identificacion: '6732442', nombre: 'STICKFORTH', direccion: 'VILLA GRAN PARQUE - CÓRDO' },
  { id: 'cli-6732443', identificacion: '6732443', nombre: 'SIEMBRA', direccion: 'ROSARIO' },
  { id: 'cli-6732444', identificacion: '6732444', nombre: 'SCRAP', direccion: 'CAMPANA' },
  { id: 'cli-6732445', identificacion: '6732445', nombre: 'SIDERCA', direccion: 'CAMPANA' },
  { id: 'cli-6732446', identificacion: '6732446', nombre: 'TOYOTA', direccion: 'ZARATE' },
  { id: 'cli-6732447', identificacion: '6732447', nombre: 'TECHINT', direccion: 'PACHECO' },
  { id: 'cli-6732448', identificacion: '6732448', nombre: 'SIPAR', direccion: 'PEREZ (ROSARIO)' },
  { id: 'cli-6732596', identificacion: '6732596', nombre: 'TECEM', direccion: 'VILLA FORTABAT (OLAVARRIA' },
  { id: 'cli-6732597', identificacion: '6732597', nombre: 'VENVER', direccion: 'COMODORO RIVADAVÍA' },
  { id: 'cli-6732600', identificacion: '6732600', nombre: 'VENVER', direccion: 'CAPITAL' },
  { id: 'cli-6732602', identificacion: '6732602', nombre: 'UGA', direccion: 'SARGENTO VIDAL' },
  { id: 'cli-6732603', identificacion: '6732603', nombre: 'VALLE', direccion: 'SAN RAFAEL' },
  { id: 'cli-6732605', identificacion: '6732605', nombre: 'VOLK', direccion: 'BENAVIDEZ' },
  { id: 'cli-6732781', identificacion: '6732781', nombre: 'GUTIERREZ', direccion: 'CASEROS' },
  { id: 'cli-6732836', identificacion: '6732836', nombre: 'ARCOR', direccion: 'LULES' },
  { id: 'cli-6732837', identificacion: '6732837', nombre: 'ARCOR', direccion: 'RECREO' },
  { id: 'cli-6732838', identificacion: '6732838', nombre: 'ARCOR', direccion: 'ARROYITO' },
  { id: 'cli-6733035', identificacion: '6733035', nombre: 'PPE ARGENT', direccion: 'HAEDO' },
  { id: 'cli-6733304', identificacion: '6733304', nombre: 'ACINDAR', direccion: 'SAN NICOLAS DE LOS ARROYO' },
  { id: 'cli-6733305', identificacion: '6733305', nombre: 'FEDERICO', direccion: 'CIUDAD AUTONOMA DE BUENOS' },
  { id: 'cli-6733330', identificacion: '6733330', nombre: 'CAROCOR', direccion: 'LUJAN' },
  { id: 'cli-6733331', identificacion: '6733331', nombre: 'CARTOCOR', direccion: 'VILLA DEL TOTORAL' },
  { id: 'cli-6733412', identificacion: '6733412', nombre: 'ARAUCO', direccion: 'PUERTO ESPERANZA' },
  { id: 'cli-6733413', identificacion: '6733413', nombre: 'CAROCOR', direccion: 'QUILMES' },
  { id: 'cli-6733452', identificacion: '6733452', nombre: 'ARAUCO', direccion: 'ZARATE' },
  { id: 'cli-6733453', identificacion: '6733453', nombre: 'ARAUCO', direccion: 'ZARATE' },
  { id: 'cli-6733454', identificacion: '6733454', nombre: 'ARAUCO', direccion: 'P.G. SAN MARTIN' },
  { id: 'cli-6733455', identificacion: '6733455', nombre: 'ARAUCO', direccion: 'PUERTO PIRAY' },
  { id: 'cli-6733463', identificacion: '6733463', nombre: 'MAXION', direccion: 'CORDOBA CAPITAL' },
  { id: 'cli-6733748', identificacion: '6733748', nombre: 'FERROSUR', direccion: 'BUENOS AIRES' },
  { id: 'cli-6733749', identificacion: '6733749', nombre: 'PAHR EDUAR', direccion: 'ELDORADO' },
  { id: 'cli-6733926', identificacion: '6733926', nombre: 'METALFOR', direccion: 'NOETINGER' },
  { id: 'cli-6733927', identificacion: '6733927', nombre: 'METALFOR', direccion: 'ROSARIO' },
  { id: 'cli-6734213', identificacion: '6734213', nombre: 'CNH', direccion: 'CORDOBA' },
  { id: 'cli-6734251', identificacion: '6734251', nombre: 'VIVANCO HN', direccion: 'GENERAL FERNANDEZ ORO' },
  { id: 'cli-6734289', identificacion: '6734289', nombre: 'INDUSTRIAL', direccion: 'GODOY CRUZ' },
  { id: 'cli-6734465', identificacion: '6734465', nombre: 'REPRESENTA', direccion: 'NEUQUEN' },
  { id: 'cli-6734466', identificacion: '6734466', nombre: 'SUPER WALT', direccion: 'LAS PAREJAS' },
  { id: 'cli-6735342', identificacion: '6735342', nombre: 'HOLCIM', direccion: 'CAMPANA' },
  { id: 'cli-6735360', identificacion: '6735360', nombre: 'YACIMIENTO', direccion: 'CABA' },
  { id: 'cli-6735361', identificacion: '6735361', nombre: 'AD BARBIER', direccion: 'BURZACO' },
  { id: 'cli-6735424', identificacion: '6735424', nombre: 'GESTION IN', direccion: 'LA ESPERANZA' },
  { id: 'cli-6737046', identificacion: '6737046', nombre: 'Y-GEN ELEC', direccion: 'CAPITAL' },
  { id: 'cli-6737163', identificacion: '6737163', nombre: 'BRACHO', direccion: 'SAN MIGUEL DE TUCUMAN' },
  { id: 'cli-6737189', identificacion: '6737189', nombre: 'CARTOCOR', direccion: 'PARANA' },
  { id: 'cli-6737259', identificacion: '6737259', nombre: 'ENERGY GRO', direccion: 'RAMOS MEJÍA - BUENOS AIR' },
  { id: 'cli-6737260', identificacion: '6737260', nombre: 'TARIFA FER', direccion: 'RANELAGH, BERAZATEGUI' },
  { id: 'cli-6738144', identificacion: '6738144', nombre: 'VAIRA (ZET', direccion: 'SAN FRANCISCO' },
  { id: 'cli-6738983', identificacion: '6738983', nombre: 'KAIKETSU S', direccion: 'OLIVOS' },
  { id: 'cli-6739559', identificacion: '6739559', nombre: 'OMAR MARTI', direccion: 'MARCOS JUAREZ' },
  { id: 'cli-6739769', identificacion: '6739769', nombre: 'PLANTIUM', direccion: 'VILLA CONSTITUCIÓN' },
  { id: 'cli-6739901', identificacion: '6739901', nombre: 'GRUPO SIMP', direccion: 'VILLA ADELINA' },
  { id: 'cli-6740164', identificacion: '6740164', nombre: 'INVESA', direccion: 'LAS PAREJAS' },
  { id: 'cli-6740834', identificacion: '6740834', nombre: 'FEDERICO', direccion: 'ROSARIO' },
  { id: 'cli-6740835', identificacion: '6740835', nombre: 'BOSCH REXR', direccion: 'CORDOBA CAPITAL' },
  { id: 'cli-6741037', identificacion: '6741037', nombre: 'IWIN ABERT', direccion: 'CAÑUELAS' },
  { id: 'cli-6741878', identificacion: '6741878', nombre: 'VANESA PAO', direccion: 'VICENTE LOPEZ' },
  { id: 'cli-6742006', identificacion: '6742006', nombre: 'I.R. INGEN', direccion: 'BUENOS AIRES' },
  { id: 'cli-6742261', identificacion: '6742261', nombre: 'OLIVERO', direccion: 'SAN NICOLAS DE LOS ARROYO' },
  { id: 'cli-6742509', identificacion: '6742509', nombre: 'CBATECHS I', direccion: 'CORDOBA' },
  { id: 'cli-6742846', identificacion: '6742846', nombre: 'GODOY', direccion: 'CIUDAD AUTONOMA DE BS.AS.' },
  { id: 'cli-6743738', identificacion: '6743738', nombre: 'ANDRITZ PU', direccion: 'PUEBLO CENTENARIO' },
  { id: 'cli-6745049', identificacion: '6745049', nombre: 'MERINGOLO', direccion: 'CARAPACHAY' },
  { id: 'cli-6745523', identificacion: '6745523', nombre: 'LENCINA', direccion: 'CARAPACHAY' },
  { id: 'cli-6745524', identificacion: '6745524', nombre: 'HANSING', direccion: 'CARAPACHAY' },
  { id: 'cli-6745525', identificacion: '6745525', nombre: 'LUNA A.', direccion: 'CARAPACHAY' },
  { id: 'cli-6745540', identificacion: '6745540', nombre: 'LUDMILA', direccion: 'CARAPACHAY' },
  { id: 'cli-6745541', identificacion: '6745541', nombre: 'PDM', direccion: 'CARAPACHAY' },
  { id: 'cli-6745542', identificacion: '6745542', nombre: 'GHERBEZZA', direccion: 'ROSARIO' },
  { id: 'cli-6745543', identificacion: '6745543', nombre: 'CACHO', direccion: 'CARAPACHAY' },
  { id: 'cli-6745570', identificacion: '6745570', nombre: 'KERKE', direccion: 'CARAPACHAY' },
  { id: 'cli-6745572', identificacion: '6745572', nombre: 'CARIN', direccion: 'CARAPACHAY' },
  { id: 'cli-6745573', identificacion: '6745573', nombre: 'JOSE', direccion: 'CARAPACHAY' },
  { id: 'cli-6745577', identificacion: '6745577', nombre: 'KARINA', direccion: 'CARAPACHAY' },
  { id: 'cli-6745580', identificacion: '6745580', nombre: 'CAROLINA', direccion: 'CARAPACHAY' },
  { id: 'cli-6745581', identificacion: '6745581', nombre: 'HECTOR', direccion: 'CARAPACHAY' },
  { id: 'cli-6745582', identificacion: '6745582', nombre: 'RICARDO', direccion: 'CARAPACHAY' },
  { id: 'cli-6745583', identificacion: '6745583', nombre: 'PABLO S', direccion: 'CARAPACHAY' },
  { id: 'cli-6745584', identificacion: '6745584', nombre: 'PABLO C', direccion: 'CARAPACHAY' },
  { id: 'cli-6745617', identificacion: '6745617', nombre: 'EZEQUIEL I', direccion: 'CARAPACHAY' },
  { id: 'cli-6745620', identificacion: '6745620', nombre: 'WALTER L', direccion: 'CARAPACHAY' },
  { id: 'cli-6745621', identificacion: '6745621', nombre: 'ALEJANDRO', direccion: 'CARAPACHAY' },
  { id: 'cli-6745622', identificacion: '6745622', nombre: 'GUSTAVO', direccion: 'CARAPACHAY' },
  { id: 'cli-6745623', identificacion: '6745623', nombre: 'DIEGO', direccion: 'CARAPACHAY' },
  { id: 'cli-6745624', identificacion: '6745624', nombre: 'DAVID', direccion: 'CARAPACHAY' },
  { id: 'cli-6745625', identificacion: '6745625', nombre: 'MIGUEL', direccion: 'CARAPACHAY' },
  { id: 'cli-6745641', identificacion: '6745641', nombre: 'MARKUS', direccion: 'CARAPACHAY' },
  { id: 'cli-6745642', identificacion: '6745642', nombre: 'TITO', direccion: 'CARAPACHAY' },
  { id: 'cli-6745643', identificacion: '6745643', nombre: 'RUSO', direccion: 'CARAPACHAY' },
  { id: 'cli-6745644', identificacion: '6745644', nombre: 'EZEQUIEL G', direccion: 'CARAPACHAY' },
  { id: 'cli-6745645', identificacion: '6745645', nombre: 'JIMI', direccion: 'CARAPACHAY' },
  { id: 'cli-6745646', identificacion: '6745646', nombre: 'DIEGUITO', direccion: 'CARAPACHAY' },
  { id: 'cli-6745647', identificacion: '6745647', nombre: 'ANDRES', direccion: 'CARAPACHAY' },
  { id: 'cli-6745654', identificacion: '6745654', nombre: 'WALTER P', direccion: 'CARAPACHAY' },
  { id: 'cli-6745655', identificacion: '6745655', nombre: 'GERARDO', direccion: 'CARAPACHAY' },
  { id: 'cli-6745656', identificacion: '6745656', nombre: 'FEDERICO', direccion: 'CARAPACHAY' },
  { id: 'cli-6745657', identificacion: '6745657', nombre: 'NACHO', direccion: 'CARAPACHAY' },
  { id: 'cli-6745658', identificacion: '6745658', nombre: 'CARLOS', direccion: 'CARAPACHAY' },
  { id: 'cli-6745659', identificacion: '6745659', nombre: 'ADALBERTO', direccion: 'CARAPACHAY' },
  { id: 'cli-6745660', identificacion: '6745660', nombre: 'VANINA', direccion: 'CARAPACHAY' },
  { id: 'cli-6745661', identificacion: '6745661', nombre: 'JONI', direccion: 'CARAPACHAY' },
  { id: 'cli-6745662', identificacion: '6745662', nombre: 'MAURICIO', direccion: 'CARAPACHAY' },
  { id: 'cli-6745663', identificacion: '6745663', nombre: 'CRISTIAN', direccion: 'CARAPACHAY' },
  { id: 'cli-6745664', identificacion: '6745664', nombre: 'BERRENDO', direccion: 'CARAPACHAY' },
  { id: 'cli-6745665', identificacion: '6745665', nombre: 'LUCAS C', direccion: 'CARAPACHAY' },
  { id: 'cli-6745666', identificacion: '6745666', nombre: 'SANTILLAN', direccion: 'CARAPACHAY' },
  { id: 'cli-6745667', identificacion: '6745667', nombre: 'MARCOS', direccion: 'CARAPACHAY' },
  { id: 'cli-6745668', identificacion: '6745668', nombre: 'GONZALO', direccion: 'CARAPACHAY' },
  { id: 'cli-6745669', identificacion: '6745669', nombre: 'MATIAS', direccion: 'CARAPACHAY' },
  { id: 'cli-6745670', identificacion: '6745670', nombre: 'LUCAS M', direccion: 'CARAPACHAY' },
  { id: 'cli-6745671', identificacion: '6745671', nombre: 'JONATHAN', direccion: 'CARAPACHAY' },
  { id: 'cli-6745672', identificacion: '6745672', nombre: 'NICOLAS C', direccion: 'CARAPACHAY' },
  { id: 'cli-6745673', identificacion: '6745673', nombre: 'JUAN', direccion: 'CARAPACHAY' },
  { id: 'cli-6745674', identificacion: '6745674', nombre: 'ADRIAN', direccion: 'CARAPACHAY' },
  { id: 'cli-6745699', identificacion: '6745699', nombre: 'FERNANDA', direccion: 'CARAPACHAY' },
  { id: 'cli-6745700', identificacion: '6745700', nombre: 'ARIADNA', direccion: 'CARAPACHAY' },
  { id: 'cli-6745701', identificacion: '6745701', nombre: 'PATRICIA', direccion: 'CARAPACHAY' },
  { id: 'cli-6745702', identificacion: '6745702', nombre: 'FRANCISCO', direccion: 'CARAPACHAY' },
  { id: 'cli-6745703', identificacion: '6745703', nombre: 'FACUNDO', direccion: 'CARAPACHAY' },
  { id: 'cli-6745704', identificacion: '6745704', nombre: 'RICARDO B', direccion: 'CARAPACHAY' },
  { id: 'cli-6745705', identificacion: '6745705', nombre: 'GONZALO S', direccion: 'CARAPACHAY' },
  { id: 'cli-6745706', identificacion: '6745706', nombre: 'SEBASTIAN', direccion: 'CARAPACHAY' },
  { id: 'cli-6745707', identificacion: '6745707', nombre: 'GUILLERMO', direccion: 'CARAPACHAY' },
  { id: 'cli-6745708', identificacion: '6745708', nombre: 'AGUSTINA', direccion: 'CARAPACHAY' },
  { id: 'cli-6745709', identificacion: '6745709', nombre: 'ULISES', direccion: 'CARAPACHAY' },
  { id: 'cli-6745710', identificacion: '6745710', nombre: 'NICOLAS P', direccion: 'CARAPACHAY' },
  { id: 'cli-6745711', identificacion: '6745711', nombre: 'TOMAS', direccion: 'CARAPACHAY' },
  { id: 'cli-6745712', identificacion: '6745712', nombre: 'CHIARA', direccion: 'CARAPACHAY' },
  { id: 'cli-6745746', identificacion: '6745746', nombre: 'Y.P.F.', direccion: 'LA PLATA' },
  { id: 'cli-6745859', identificacion: '6745859', nombre: 'MONDELEZ', direccion: 'PACHECO' },
  { id: 'cli-6746194', identificacion: '6746194', nombre: 'GODOY', direccion: 'SAN MIGUEL DE TUCUMAN' },
  { id: 'cli-6746236', identificacion: '6746236', nombre: 'PYFSA ROBO', direccion: 'CIUDAD AUTONOMA DE BUENOS' },
  { id: 'cli-6746241', identificacion: '6746241', nombre: 'DONDA', direccion: 'CASEROS' },
  { id: 'cli-6746381', identificacion: '6746381', nombre: 'LIEBHERR A', direccion: 'SAN JUAN' },
  { id: 'cli-6746420', identificacion: '6746420', nombre: 'SACEEM S.A', direccion: 'MONTEVIDEO' },
  { id: 'cli-6746421', identificacion: '6746421', nombre: 'SARBILCO S', direccion: 'MONTEVIDEO' },
  { id: 'cli-6746438', identificacion: '6746438', nombre: 'ARCOR', direccion: 'MAR DEL PLATA' },
  { id: 'cli-6746525', identificacion: '6746525', nombre: 'CONEXYS', direccion: 'ROSARIO' },
  { id: 'cli-6746991', identificacion: '6746991', nombre: 'SOMASOL SA', direccion: 'MONTEVIDEO' },
  { id: 'cli-6747484', identificacion: '6747484', nombre: 'MOVIMIENTO', direccion: 'MAR DEL PLATA' },
  { id: 'cli-6747752', identificacion: '6747752', nombre: 'HOLCIM', direccion: 'PUESTO VIEJO' },
  { id: 'cli-6747780', identificacion: '6747780', nombre: 'BOURNOT', direccion: 'SAN MARTÍN' },
  { id: 'cli-6748052', identificacion: '6748052', nombre: 'BLANVIRA S', direccion: 'PUEBLO CENTENARIO' },
  { id: 'cli-6748063', identificacion: '6748063', nombre: 'IMPERIO', direccion: 'MONTECRISTO' },
  { id: 'cli-6748196', identificacion: '6748196', nombre: 'METALMECAN', direccion: 'VILLA MERCEDES' },
  { id: 'cli-6748237', identificacion: '6748237', nombre: 'TERNIUM', direccion: 'ENSENADA' },
  { id: 'cli-6748238', identificacion: '6748238', nombre: 'TERNIUM', direccion: 'FLORENCIO VARELA' },
  { id: 'cli-6748239', identificacion: '6748239', nombre: 'TERNIUM', direccion: 'ROSARIO' },
  { id: 'cli-6748240', identificacion: '6748240', nombre: 'TERNIUM', direccion: 'RAMALLO' },
  { id: 'cli-6748347', identificacion: '6748347', nombre: 'INFA', direccion: 'EL TALAR' },
  { id: 'cli-6748348', identificacion: '6748348', nombre: 'IMPSA', direccion: 'GODOY CRUZ' },
  { id: 'cli-6748797', identificacion: '6748797', nombre: 'HEXATECHNI', direccion: 'CORDOBA' },
  { id: 'cli-6748849', identificacion: '6748849', nombre: 'INDUSTRIAS', direccion: 'BURZACO' },
  { id: 'cli-6748856', identificacion: '6748856', nombre: 'JORGE', direccion: 'SAN NICOLÁS DE LOS ARROYO' },
  { id: 'cli-6749375', identificacion: '6749375', nombre: 'KRANEVITTE', direccion: 'RAFAELA' },
  { id: 'cli-6749518', identificacion: '6749518', nombre: 'RODAMIENTO', direccion: 'RAFAELA' },
  { id: 'cli-6749522', identificacion: '6749522', nombre: 'SIAT', direccion: 'VILLA CONSTITUCION' },
  { id: 'cli-6749877', identificacion: '6749877', nombre: 'SEABOARD', direccion: 'EL TABACAL PARAJE' },
  { id: 'cli-6749905', identificacion: '6749905', nombre: 'OILFIELD', direccion: 'NEUQUÉN' },
  { id: 'cli-6749956', identificacion: '6749956', nombre: 'RECYCOMB', direccion: 'BUENOS AIRES' },
];

export const INITIAL_CATEGORIES: CategoryOption[] = [
  { id: 'cat-1', nombre: 'Servicio' },
  { id: 'cat-2', nombre: 'Post Venta Good Will' },
  { id: 'cat-3', nombre: 'Garantía' },
];

export const INITIAL_SERVICE_TYPES: ServiceTypeOption[] = [
  { id: 'st-1', codigo: 'IH', nombre: 'Inspección Hidráulica / Mantenimiento' },
  { id: 'st-2', codigo: 'FA', nombre: 'Diagnóstico de Falla' },
  { id: 'st-3', codigo: 'EA', nombre: 'Ensamblado y Puesta en Marcha' },
  { id: 'st-4', codigo: 'HD', nombre: 'Hidráulica Digital & Calibración' },
  { id: 'st-5', codigo: 'MH', nombre: 'Mantenimiento Preventivo / Correctivo' },
];

export const INITIAL_CONTRACTS: ContractOption[] = [
  { id: 'con-1', numero: '6700344049', descripcion: 'Ternium Argentina - Servicio de Campo' },
  { id: 'con-2', numero: '6700319284', descripcion: 'Siderca S.A. - Contrato de Asistencia' },
];

export const INITIAL_TECHNICIAN_ROLES: TechnicianRoleOption[] = [
  { id: 'tech-1', nombre: 'Especialista' },
  { id: 'tech-2', nombre: 'Técnico' },
  { id: 'tech-3', nombre: 'Ayudante' },
];

export const INITIAL_REPORTS: FieldServiceReport[] = [
  {
    id: 'rep-2026-001',
    numeroFormulario: 'FR82155-4',
    numeroServicio: 'SVC-2026-001',
    fecha: '2026-07-20',
    cliente: 'Ternium Argentina S.A.',
    direccion: 'Planta General Savio, Ramallo, Buenos Aires',
    tipoServicio: 'IH',
    categoria: 'Servicio',
    numeroOrdenCompra: 'OC-98231',
    numeroContrato: '6700344049 Ternium',
    numeroOrdenTrabajo: 'OT-4421',
    detalleProblema:
      'Se detectó variación anormal de presión en la central hidráulica del laminador en caliente. Fuga localizada en bloque de acondicionamiento de servoválvulas.',
    tecnicosInsumidos: [
      { id: 'ta-1', categoria: 'Especialista', cantidad: 2, fecha: '2026-07-20' },
      { id: 'ta-2', categoria: 'Técnico', cantidad: 1, fecha: '2026-07-20' },
    ],
    diasHorasConsumidas: [
      {
        id: 'dh-1',
        fecha: '2026-07-20',
        esFeriado: false,
        horaViaje: 4.0,
        horaIngreso: '07:00',
        horaEgreso: '18:00',
      },
    ],
    tareasRealizadas:
      '1. Desmontaje y despresurización de la central hidráulica Rexroth.\n2. Reemplazo de sellos vitón de alta temperatura en servoválvula 4WRPEH.\n3. Medición de contaminación ISO 4406 con contador de partículas en línea.\n4. Ajuste de presiones de alivio secundarias y prueba bajo carga.',
    recomendacionConclusion:
      'Se recomienda realizar purga de acumuladores nitrógeno en el próximo paro programado y sustitución de elementos filtrantes de 3 micras.',
    instrumentosUtilizados: [
      { id: 'inst-1', cantidad: 1, descripcion: 'Manómetro digital de precisión Rexroth Hydroclean' },
      { id: 'inst-2', cantidad: 1, descripcion: 'Contador de partículas portátil ISO 4406' },
    ],
    materialesUtilizados: [
      { id: 'mat-1', cantidad: 2, codigoMNR: 'R901089221', descripcion: 'Juego de sellos O-ring Vitón Rexroth' },
      { id: 'mat-2', cantidad: 1, codigoMNR: 'R928006812', descripcion: 'Elemento filtrante hidráulico 10 micron' },
    ],
    registroFotografico: [],
    firmas: {
      firmaTecnico: '',
      aclaracionTecnico: 'Ing. Carlos Rossi - Rexroth Service',
      firmaCliente: '',
      aclaracionCliente: 'Supervisión de Mantenimiento Ternium',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

let supabaseClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (supabaseClient) return supabaseClient;

  // Check env vars or localStorage config
  let url = (import.meta as any).env?.VITE_SUPABASE_URL || '';
  let key = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

  const customCfg = localStorage.getItem(STORAGE_KEYS.CONFIG);
  if (customCfg) {
    try {
      const parsed = JSON.parse(customCfg);
      if (parsed.url && parsed.key) {
        url = parsed.url;
        key = parsed.key;
      }
    } catch (e) {
      console.error(e);
    }
  }

  if (url && key) {
    try {
      supabaseClient = createClient(url, key);
    } catch (e) {
      console.error('Error initializing Supabase client:', e);
    }
  }
  return supabaseClient;
}

export function saveSupabaseConfig(url: string, key: string) {
  localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify({ url, key }));
  supabaseClient = null;
  return getSupabaseClient();
}

export function getSupabaseConfig(): { url: string; key: string } {
  const customCfg = localStorage.getItem(STORAGE_KEYS.CONFIG);
  if (customCfg) {
    try {
      return JSON.parse(customCfg);
    } catch (e) {
      // ignore
    }
  }
  return {
    url: (import.meta as any).env?.VITE_SUPABASE_URL || '',
    key: (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '',
  };
}

// Data Store Layer (Reads/Writes to localStorage with async Supabase sync)
export async function getReports(): Promise<FieldServiceReport[]> {
  const local = localStorage.getItem(STORAGE_KEYS.REPORTS);
  let reports: FieldServiceReport[] = local ? JSON.parse(local) : INITIAL_REPORTS;

  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client.from('field_service_reports').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        reports = data.map((item) => ({
          id: item.id,
          numeroFormulario: item.numero_formulario || 'FR82155-4',
          numeroServicio: item.numero_servicio,
          fecha: item.fecha,
          cliente: item.cliente,
          direccion: item.direccion,
          tipoServicio: item.tipo_servicio,
          categoria: item.categoria,
          numeroOrdenCompra: item.numero_orden_compra,
          numeroContrato: item.numero_contrato,
          numeroOrdenTrabajo: item.numero_orden_trabajo,
          detalleProblema: item.detalle_problema,
          tecnicosInsumidos: item.tecnicos_insumidos || [],
          diasHorasConsumidas: item.dias_horas_consumidas || [],
          tareasRealizadas: item.tareas_realizadas,
          recomendacionConclusion: item.recomendacion_conclusion,
          instrumentosUtilizados: item.instrumentos_utilizados || [],
          materialesUtilizados: item.materiales_utilizados || [],
          registroFotografico: item.registro_fotografico || [],
          firmas: item.firmas || { firmaTecnico: '', aclaracionTecnico: '', firmaCliente: '', aclaracionCliente: '' },
          createdAt: item.created_at,
          updatedAt: item.updated_at,
        }));
        localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
      }
    } catch (err) {
      console.warn('Supabase fetch failed, fallback to local storage:', err);
    }
  }

  return reports;
}

export async function saveReport(report: FieldServiceReport): Promise<FieldServiceReport> {
  const reports = await getReports();
  const existingIdx = reports.findIndex((r) => r.id === report.id);

  const now = new Date().toISOString();
  const updatedReport = {
    ...report,
    updatedAt: now,
    createdAt: report.createdAt || now,
  };

  if (existingIdx >= 0) {
    reports[existingIdx] = updatedReport;
  } else {
    reports.unshift(updatedReport);
  }

  localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));

  const client = getSupabaseClient();
  if (client) {
    try {
      await client.from('field_service_reports').upsert({
        id: updatedReport.id,
        numero_formulario: updatedReport.numeroFormulario,
        numero_servicio: updatedReport.numeroServicio,
        fecha: updatedReport.fecha,
        cliente: updatedReport.cliente,
        direccion: updatedReport.direccion,
        tipo_servicio: updatedReport.tipoServicio,
        categoria: updatedReport.categoria,
        numero_orden_compra: updatedReport.numeroOrdenCompra,
        numero_contrato: updatedReport.numeroContrato,
        numero_orden_trabajo: updatedReport.numeroOrdenTrabajo,
        detalle_problema: updatedReport.detalleProblema,
        tecnicos_insumidos: updatedReport.tecnicosInsumidos,
        dias_horas_consumidas: updatedReport.diasHorasConsumidas,
        tareas_realizadas: updatedReport.tareasRealizadas,
        recomendacion_conclusion: updatedReport.recomendacionConclusion,
        instrumentos_utilizados: updatedReport.instrumentosUtilizados,
        materiales_utilizados: updatedReport.materialesUtilizados,
        registro_fotografico: updatedReport.registroFotografico,
        firmas: updatedReport.firmas,
        updated_at: now,
      });
    } catch (err) {
      console.warn('Supabase save failed:', err);
    }
  }

  return updatedReport;
}

export async function deleteReport(id: string): Promise<void> {
  const reports = await getReports();
  const filtered = reports.filter((r) => r.id !== id);
  localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(filtered));

  const client = getSupabaseClient();
  if (client) {
    try {
      await client.from('field_service_reports').delete().eq('id', id);
    } catch (err) {
      console.warn('Supabase delete failed:', err);
    }
  }
}

// CLIENTS CRUD
const CLIENTS_VERSION_KEY = 'rexroth_fs_clients_version_v5';

export async function resetClientsToOfficialList(): Promise<Client[]> {
  localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(INITIAL_CLIENTS));
  localStorage.setItem(CLIENTS_VERSION_KEY, 'v5');

  const client = getSupabaseClient();
  if (client) {
    try {
      // Upsert official clients to Supabase table
      const payload = INITIAL_CLIENTS.map((c) => ({
        id: c.id,
        identificacion: c.identificacion,
        nombre: c.nombre,
        direccion: c.direccion,
      }));
      await client.from('clients').upsert(payload, { onConflict: 'id' });
    } catch (err) {
      console.warn('Supabase reset clients error:', err);
    }
  }
  return INITIAL_CLIENTS;
}

export async function syncClientsToSupabase(): Promise<{ success: boolean; count: number; error?: string }> {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, count: 0, error: 'Supabase no está configurado. Ingrese URL y ANON Key en Configuración.' };
  }

  const clients = await getClients();
  try {
    const payload = clients.map((c) => ({
      id: c.id,
      identificacion: c.identificacion,
      nombre: c.nombre,
      direccion: c.direccion,
    }));

    const { error } = await client.from('clients').upsert(payload, { onConflict: 'id' });
    if (error) throw error;

    return { success: true, count: payload.length };
  } catch (err: any) {
    console.error('Error syncing clients to Supabase:', err);
    return { success: false, count: 0, error: err.message || 'Error al conectar con la tabla clients de Supabase' };
  }
}

export async function getClients(): Promise<Client[]> {
  // Check version flag to migrate local storage to the new complete official CSV list
  if (localStorage.getItem(CLIENTS_VERSION_KEY) !== 'v5') {
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(INITIAL_CLIENTS));
    localStorage.setItem(CLIENTS_VERSION_KEY, 'v5');
  }

  let clients: Client[] = INITIAL_CLIENTS;
  const local = localStorage.getItem(STORAGE_KEYS.CLIENTS);
  if (local) {
    try {
      clients = JSON.parse(local);
    } catch (e) {
      clients = INITIAL_CLIENTS;
    }
  }

  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client.from('clients').select('*').order('nombre', { ascending: true });
      if (!error && data && data.length > 0) {
        clients = data.map((item) => ({
          id: item.id || `cli-${item.identificacion || Math.random()}`,
          identificacion: item.identificacion || '',
          nombre: item.nombre || '',
          direccion: item.direccion || '',
          createdAt: item.created_at,
        }));
        localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
      }
    } catch (err) {
      console.warn('Supabase clients fetch error:', err);
    }
  }

  return clients;
}

export async function saveClient(clientData: Client): Promise<Client[]> {
  const clients = await getClients();
  const idx = clients.findIndex((c) => c.id === clientData.id);
  if (idx >= 0) clients[idx] = clientData;
  else clients.push(clientData);
  localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));

  const client = getSupabaseClient();
  if (client) {
    try {
      await client.from('clients').upsert({
        id: clientData.id,
        identificacion: clientData.identificacion,
        nombre: clientData.nombre,
        direccion: clientData.direccion,
      });
    } catch (err) {
      console.warn('Supabase client save error:', err);
    }
  }

  return clients;
}

export async function deleteClient(id: string): Promise<Client[]> {
  const clients = await getClients();
  const filtered = clients.filter((c) => c.id !== id);
  localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(filtered));

  const client = getSupabaseClient();
  if (client) {
    try {
      await client.from('clients').delete().eq('id', id);
    } catch (err) {
      console.warn('Supabase client delete error:', err);
    }
  }

  return filtered;
}

// OPTIONS MANAGEMENT (Categories, Service Types, Contracts, Technicians)
export function getStoredOptions<T>(key: string, initial: T[]): T[] {
  const local = localStorage.getItem(key);
  if (local) {
    try {
      return JSON.parse(local);
    } catch (e) {
      // fallback
    }
  }
  localStorage.setItem(key, JSON.stringify(initial));
  return initial;
}

export function saveStoredOptions<T>(key: string, items: T[]): void {
  localStorage.setItem(key, JSON.stringify(items));
}

export const getCategories = () => getStoredOptions(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
export const saveCategories = (cats: CategoryOption[]) => saveStoredOptions(STORAGE_KEYS.CATEGORIES, cats);

export const getServiceTypes = () => getStoredOptions(STORAGE_KEYS.SERVICE_TYPES, INITIAL_SERVICE_TYPES);
export const saveServiceTypes = (st: ServiceTypeOption[]) => saveStoredOptions(STORAGE_KEYS.SERVICE_TYPES, st);

export const getContracts = () => getStoredOptions(STORAGE_KEYS.CONTRACTS, INITIAL_CONTRACTS);
export const saveContracts = (c: ContractOption[]) => saveStoredOptions(STORAGE_KEYS.CONTRACTS, c);

export const getTechnicians = () => getStoredOptions(STORAGE_KEYS.TECHNICIANS, INITIAL_TECHNICIAN_ROLES);
export const saveTechnicians = (t: TechnicianRoleOption[]) => saveStoredOptions(STORAGE_KEYS.TECHNICIANS, t);
