import { file_clientmetrics } from './steam/clientmetrics_pb.ts'
import { file_content_manifest } from './steam/content_manifest_pb.ts'
import { file_contenthubs } from './steam/contenthubs_pb.ts'
import { file_encrypted_app_ticket } from './steam/encrypted_app_ticket_pb.ts'
import { EMsg, file_enums_clientserver } from './steam/enums_clientserver_pb.ts'
import { file_enums } from './steam/enums_pb.ts'
import { file_enums_productinfo } from './steam/enums_productinfo_pb.ts'
import { file_htmlmessages } from './steam/htmlmessages_pb.ts'
import { file_offline_ticket } from './steam/offline_ticket_pb.ts'
import { file_steamdatagram_messages_auth } from './steam/steamdatagram_messages_auth_pb.ts'
import { file_steamdatagram_messages_sdr } from './steam/steamdatagram_messages_sdr_pb.ts'
import { file_steammessages_accounthardware_steamclient } from './steam/steammessages_accounthardware.steamclient_pb.ts'
import { file_steammessages_appoverview } from './steam/steammessages_appoverview_pb.ts'
import { file_steammessages_auth_steamclient } from './steam/steammessages_auth.steamclient_pb.ts'
import { file_steammessages_base } from './steam/steammessages_base_pb.ts'
import { file_steammessages_broadcast_steamclient } from './steam/steammessages_broadcast.steamclient_pb.ts'
import { file_steammessages_chat_steamclient } from './steam/steammessages_chat.steamclient_pb.ts'
import { file_steammessages_childprocessquery } from './steam/steammessages_childprocessquery_pb.ts'
import { file_steammessages_client_objects } from './steam/steammessages_client_objects_pb.ts'
import { file_steammessages_clientlanp2p } from './steam/steammessages_clientlanp2p_pb.ts'
import { file_steammessages_clientmetrics_steamclient } from './steam/steammessages_clientmetrics.steamclient_pb.ts'
import { file_steammessages_clientnotificationtypes } from './steam/steammessages_clientnotificationtypes_pb.ts'
import {
  CMsgClientPlayingSessionStateSchema,
  CMsgClientUIModeSchema,
  CMsgDPGetNumberOfCurrentPlayersResponseSchema,
  CMsgDPGetNumberOfCurrentPlayersSchema,
  CMsgGCClientSchema,
  file_steammessages_clientserver_2,
} from './steam/steammessages_clientserver_2_pb.ts'
import { file_steammessages_clientserver_appinfo } from './steam/steammessages_clientserver_appinfo_pb.ts'
import {
  CMsgClientFriendMsgIncomingSchema,
  file_steammessages_clientserver_friends,
} from './steam/steammessages_clientserver_friends_pb.ts'
import {
  CMsgGameServerDataSchema,
  file_steammessages_clientserver_gameservers,
} from './steam/steammessages_clientserver_gameservers_pb.ts'
import { file_steammessages_clientserver_lbs } from './steam/steammessages_clientserver_lbs_pb.ts'
import {
  CMsgClientLogonSchema,
  file_steammessages_clientserver_login,
} from './steam/steammessages_clientserver_login_pb.ts'
import { file_steammessages_clientserver_mms } from './steam/steammessages_clientserver_mms_pb.ts'
import {
  CMsgClientGamesPlayedSchema,
  CMsgClientNetworkingCertReplySchema,
  file_steammessages_clientserver,
} from './steam/steammessages_clientserver_pb.ts'
import { file_steammessages_clientserver_ucm } from './steam/steammessages_clientserver_ucm_pb.ts'
import { file_steammessages_clientserver_uds } from './steam/steammessages_clientserver_uds_pb.ts'
import { file_steammessages_clientserver_ufs } from './steam/steammessages_clientserver_ufs_pb.ts'
import { file_steammessages_clientserver_userstats } from './steam/steammessages_clientserver_userstats_pb.ts'
import { file_steammessages_clientserver_video } from './steam/steammessages_clientserver_video_pb.ts'
import { file_steammessages_clientsettings } from './steam/steammessages_clientsettings_pb.ts'
import { file_steammessages_cloud_steamclient } from './steam/steammessages_cloud.steamclient_pb.ts'
import { file_steammessages_community_steamclient } from './steam/steammessages_community.steamclient_pb.ts'
import { file_steammessages_contentsystem_steamclient } from './steam/steammessages_contentsystem.steamclient_pb.ts'
import { file_steammessages_credentials_steamclient } from './steam/steammessages_credentials.steamclient_pb.ts'
import { file_steammessages_datapublisher_steamclient } from './steam/steammessages_datapublisher.steamclient_pb.ts'
import { file_steammessages_depotbuilder_steamclient } from './steam/steammessages_depotbuilder.steamclient_pb.ts'
import { file_steammessages_econ_steamclient } from './steam/steammessages_econ.steamclient_pb.ts'
import { file_steammessages_familygroups_steamclient } from './steam/steammessages_familygroups.steamclient_pb.ts'
import { file_steammessages_friendmessages_steamclient } from './steam/steammessages_friendmessages.steamclient_pb.ts'
import { file_steammessages_gamenetworking_steamclient } from './steam/steammessages_gamenetworking.steamclient_pb.ts'
import { file_steammessages_gamenetworkingui } from './steam/steammessages_gamenetworkingui_pb.ts'
import { file_steammessages_gamenotifications_steamclient } from './steam/steammessages_gamenotifications.steamclient_pb.ts'
import { file_steammessages_gamerecording_steamclient } from './steam/steammessages_gamerecording.steamclient_pb.ts'
import { file_steammessages_gamerecording_objects } from './steam/steammessages_gamerecording_objects_pb.ts'
import { file_steammessages_gameservers_steamclient } from './steam/steammessages_gameservers.steamclient_pb.ts'
import { file_steammessages_hiddevices } from './steam/steammessages_hiddevices_pb.ts'
import { file_steammessages_inventory_steamclient } from './steam/steammessages_inventory.steamclient_pb.ts'
import { file_steammessages_linkfilter_steamclient } from './steam/steammessages_linkfilter.steamclient_pb.ts'
import { file_steammessages_lobbymatchmaking_steamclient } from './steam/steammessages_lobbymatchmaking.steamclient_pb.ts'
import { file_steammessages_market_steamclient } from './steam/steammessages_market.steamclient_pb.ts'
import { file_steammessages_marketingmessages_steamclient } from './steam/steammessages_marketingmessages.steamclient_pb.ts'
import { file_steammessages_notifications_steamclient } from './steam/steammessages_notifications.steamclient_pb.ts'
import { file_steammessages_offline_steamclient } from './steam/steammessages_offline.steamclient_pb.ts'
import { file_steammessages_parental_steamclient } from './steam/steammessages_parental.steamclient_pb.ts'
import { file_steammessages_parental_objects } from './steam/steammessages_parental_objects_pb.ts'
import { file_steammessages_parties_steamclient } from './steam/steammessages_parties.steamclient_pb.ts'
import { file_steammessages_partnerapps_steamclient } from './steam/steammessages_partnerapps.steamclient_pb.ts'
import { file_steammessages_player_steamclient } from './steam/steammessages_player.steamclient_pb.ts'
import { file_steammessages_publishedfile_steamclient } from './steam/steammessages_publishedfile.steamclient_pb.ts'
import { file_steammessages_qms_steamclient } from './steam/steammessages_qms.steamclient_pb.ts'
import { file_steammessages_remoteclient_discovery } from './steam/steammessages_remoteclient_discovery_pb.ts'
import { file_steammessages_remoteclient } from './steam/steammessages_remoteclient_pb.ts'
import { file_steammessages_remoteclient_service_steamclient } from './steam/steammessages_remoteclient_service.steamclient_pb.ts'
import { file_steammessages_remoteclient_service_messages } from './steam/steammessages_remoteclient_service_messages_pb.ts'
import { file_steammessages_remoteplay } from './steam/steammessages_remoteplay_pb.ts'
import { file_steammessages_secrets_steamclient } from './steam/steammessages_secrets.steamclient_pb.ts'
import { file_steammessages_shader_steamclient } from './steam/steammessages_shader.steamclient_pb.ts'
import { file_steammessages_site_license_steamclient } from './steam/steammessages_site_license.steamclient_pb.ts'
import { file_steammessages_sitelicenseclient } from './steam/steammessages_sitelicenseclient_pb.ts'
import { file_steammessages_siteserverui } from './steam/steammessages_siteserverui_pb.ts'
import { file_steammessages_steamtv_steamclient } from './steam/steammessages_steamtv.steamclient_pb.ts'
import { file_steammessages_store_steamclient } from './steam/steammessages_store.steamclient_pb.ts'
import { file_steammessages_storebrowse_steamclient } from './steam/steammessages_storebrowse.steamclient_pb.ts'
import { file_steammessages_timedtrial_steamclient } from './steam/steammessages_timedtrial.steamclient_pb.ts'
import { file_steammessages_twofactor_steamclient } from './steam/steammessages_twofactor.steamclient_pb.ts'
import { file_steammessages_unified_base_steamclient } from './steam/steammessages_unified_base.steamclient_pb.ts'
import { file_steammessages_unified_test_steamclient } from './steam/steammessages_unified_test.steamclient_pb.ts'
import { file_steammessages_useraccount_steamclient } from './steam/steammessages_useraccount.steamclient_pb.ts'
import { file_steammessages_vac_steamclient } from './steam/steammessages_vac.steamclient_pb.ts'
import { file_steammessages_video_steamclient } from './steam/steammessages_video.steamclient_pb.ts'
import { file_steammessages_virtualcontroller } from './steam/steammessages_virtualcontroller_pb.ts'
import { file_steammessages_workshop_steamclient } from './steam/steammessages_workshop.steamclient_pb.ts'
import { file_steamnetworkingsockets_messages_certs } from './steam/steamnetworkingsockets_messages_certs_pb.ts'
import { file_steamnetworkingsockets_messages } from './steam/steamnetworkingsockets_messages_pb.ts'
import { file_steamnetworkingsockets_messages_udp } from './steam/steamnetworkingsockets_messages_udp_pb.ts'
import { file_webuimessages_achievements } from './steam/webuimessages_achievements_pb.ts'
import { file_webuimessages_base } from './steam/webuimessages_base_pb.ts'
import { file_webuimessages_bluetooth } from './steam/webuimessages_bluetooth_pb.ts'
import { file_webuimessages_gamenotes } from './steam/webuimessages_gamenotes_pb.ts'
import { file_webuimessages_gamerecording } from './steam/webuimessages_gamerecording_pb.ts'
import { file_webuimessages_gamerecordingfiles } from './steam/webuimessages_gamerecordingfiles_pb.ts'
import { file_webuimessages_gamescope } from './steam/webuimessages_gamescope_pb.ts'
import { file_webuimessages_hardwareupdate } from './steam/webuimessages_hardwareupdate_pb.ts'
import { file_webuimessages_leds } from './steam/webuimessages_leds_pb.ts'
import { file_webuimessages_sharedjscontext } from './steam/webuimessages_sharedjscontext_pb.ts'
import { file_webuimessages_sleep } from './steam/webuimessages_sleep_pb.ts'
import { file_webuimessages_steamengine } from './steam/webuimessages_steamengine_pb.ts'
import { file_webuimessages_steaminput } from './steam/webuimessages_steaminput_pb.ts'
import { file_webuimessages_steamos } from './steam/webuimessages_steamos_pb.ts'
import { file_webuimessages_storagedevicemanager } from './steam/webuimessages_storagedevicemanager_pb.ts'
import { file_webuimessages_systemmanager } from './steam/webuimessages_systemmanager_pb.ts'
import { file_webuimessages_transport } from './steam/webuimessages_transport_pb.ts'
import { file_webuimessages_transportvalidation } from './steam/webuimessages_transportvalidation_pb.ts'
import type { DescMessage } from '@bufbuild/protobuf'

export const steamProtoDescs = [
  file_clientmetrics,
  file_content_manifest,
  file_contenthubs,
  file_encrypted_app_ticket,
  file_enums_clientserver,
  file_enums,
  file_enums_productinfo,
  file_htmlmessages,
  file_offline_ticket,
  file_steamdatagram_messages_auth,
  file_steamdatagram_messages_sdr,
  file_steammessages_accounthardware_steamclient,
  file_steammessages_appoverview,
  file_steammessages_auth_steamclient,
  file_steammessages_base,
  file_steammessages_broadcast_steamclient,
  file_steammessages_chat_steamclient,
  file_steammessages_childprocessquery,
  file_steammessages_client_objects,
  file_steammessages_clientlanp2p,
  file_steammessages_clientmetrics_steamclient,
  file_steammessages_clientnotificationtypes,
  file_steammessages_clientserver_2,
  file_steammessages_clientserver_appinfo,
  file_steammessages_clientserver_friends,
  file_steammessages_clientserver_gameservers,
  file_steammessages_clientserver_lbs,
  file_steammessages_clientserver_login,
  file_steammessages_clientserver_mms,
  file_steammessages_clientserver,
  file_steammessages_clientserver_ucm,
  file_steammessages_clientserver_uds,
  file_steammessages_clientserver_ufs,
  file_steammessages_clientserver_userstats,
  file_steammessages_clientserver_video,
  file_steammessages_clientsettings,
  file_steammessages_cloud_steamclient,
  file_steammessages_community_steamclient,
  file_steammessages_contentsystem_steamclient,
  file_steammessages_credentials_steamclient,
  file_steammessages_datapublisher_steamclient,
  file_steammessages_depotbuilder_steamclient,
  file_steammessages_econ_steamclient,
  file_steammessages_familygroups_steamclient,
  file_steammessages_friendmessages_steamclient,
  file_steammessages_gamenetworking_steamclient,
  file_steammessages_gamenetworkingui,
  file_steammessages_gamenotifications_steamclient,
  file_steammessages_gamerecording_steamclient,
  file_steammessages_gamerecording_objects,
  file_steammessages_gameservers_steamclient,
  file_steammessages_hiddevices,
  file_steammessages_inventory_steamclient,
  file_steammessages_linkfilter_steamclient,
  file_steammessages_lobbymatchmaking_steamclient,
  file_steammessages_market_steamclient,
  file_steammessages_marketingmessages_steamclient,
  file_steammessages_notifications_steamclient,
  file_steammessages_offline_steamclient,
  file_steammessages_parental_steamclient,
  file_steammessages_parental_objects,
  file_steammessages_parties_steamclient,
  file_steammessages_partnerapps_steamclient,
  file_steammessages_player_steamclient,
  file_steammessages_publishedfile_steamclient,
  file_steammessages_qms_steamclient,
  file_steammessages_remoteclient_discovery,
  file_steammessages_remoteclient,
  file_steammessages_remoteclient_service_steamclient,
  file_steammessages_remoteclient_service_messages,
  file_steammessages_remoteplay,
  file_steammessages_secrets_steamclient,
  file_steammessages_shader_steamclient,
  file_steammessages_site_license_steamclient,
  file_steammessages_sitelicenseclient,
  file_steammessages_siteserverui,
  file_steammessages_steamtv_steamclient,
  file_steammessages_store_steamclient,
  file_steammessages_storebrowse_steamclient,
  file_steammessages_timedtrial_steamclient,
  file_steammessages_twofactor_steamclient,
  file_steammessages_unified_base_steamclient,
  file_steammessages_unified_test_steamclient,
  file_steammessages_useraccount_steamclient,
  file_steammessages_vac_steamclient,
  file_steammessages_video_steamclient,
  file_steammessages_virtualcontroller,
  file_steammessages_workshop_steamclient,
  file_steamnetworkingsockets_messages_certs,
  file_steamnetworkingsockets_messages,
  file_steamnetworkingsockets_messages_udp,
  file_webuimessages_achievements,
  file_webuimessages_base,
  file_webuimessages_bluetooth,
  file_webuimessages_gamenotes,
  file_webuimessages_gamerecording,
  file_webuimessages_gamerecordingfiles,
  file_webuimessages_gamescope,
  file_webuimessages_hardwareupdate,
  file_webuimessages_leds,
  file_webuimessages_sharedjscontext,
  file_webuimessages_sleep,
  file_webuimessages_steamengine,
  file_webuimessages_steaminput,
  file_webuimessages_steamos,
  file_webuimessages_storagedevicemanager,
  file_webuimessages_systemmanager,
  file_webuimessages_transport,
  file_webuimessages_transportvalidation,
]

const eMsgToProto = new Map<number, DescMessage>()
eMsgToProto.set(EMsg.k_EMsgClientLogonGameServer, CMsgClientLogonSchema)
eMsgToProto.set(EMsg.k_EMsgClientGamesPlayed, CMsgClientGamesPlayedSchema)
eMsgToProto.set(EMsg.k_EMsgClientGamesPlayedNoDataBlob, CMsgClientGamesPlayedSchema)
eMsgToProto.set(EMsg.k_EMsgClientGamesPlayedWithDataBlob, CMsgClientGamesPlayedSchema)
eMsgToProto.set(EMsg.k_EMsgClientToGC, CMsgGCClientSchema)
eMsgToProto.set(EMsg.k_EMsgClientFromGC, CMsgGCClientSchema)
eMsgToProto.set(EMsg.k_EMsgClientFriendMsgIncoming, CMsgClientFriendMsgIncomingSchema)
eMsgToProto.set(EMsg.k_EMsgClientFriendMsgEchoToSender, CMsgClientFriendMsgIncomingSchema)
eMsgToProto.set(EMsg.k_EMsgClientCurrentUIMode, CMsgClientUIModeSchema)
eMsgToProto.set(EMsg.k_EMsgClientGetNumberOfCurrentPlayersDP, CMsgDPGetNumberOfCurrentPlayersSchema)
eMsgToProto.set(EMsg.k_EMsgClientGetNumberOfCurrentPlayersDPResponse, CMsgDPGetNumberOfCurrentPlayersResponseSchema)
eMsgToProto.set(EMsg.k_EMsgAMGameServerUpdate, CMsgGameServerDataSchema)
// eMsgToProto.set(EMsg.k_EMsgClientDPUpdateAppJobReport, typeof SteamKit2.WebUI.Internal.CMsgClientUpdateAppJobReport)
eMsgToProto.set(EMsg.k_EMsgClientPlayingSessionState, CMsgClientPlayingSessionStateSchema)
eMsgToProto.set(EMsg.k_EMsgClientNetworkingCertRequestResponse, CMsgClientNetworkingCertReplySchema)

export function getProtoFromEMsg(eMsg: number, name?: string): DescMessage | undefined {
  const cached = eMsgToProto.get(eMsg)
  if (!cached) {
    if (!name) return undefined
    const lowerName = name.toLowerCase()
    let msgDesc: DescMessage | undefined = undefined
    for (const desc of steamProtoDescs) {
      const locMsgDesc = desc.messages.find((a) => a.name.toLowerCase().endsWith(lowerName))
      if (locMsgDesc) {
        msgDesc = locMsgDesc
        break
      }
    }

    if (msgDesc) {
      eMsgToProto.set(eMsg, msgDesc)
    }
    return msgDesc
  }
  return cached
}
