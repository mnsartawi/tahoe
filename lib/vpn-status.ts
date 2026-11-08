export const VPN_ENABLED_STORAGE_KEY = "tahoe-vpn"
export const VPN_CONNECTED_CONFIG_STORAGE_KEY = "tahoe-vpn-connected-config"
export const VPN_MENU_BAR_STORAGE_KEY = "tahoe-vpn-menu-bar"
export const VPN_STATUS_EVENT = "tahoe-vpn-status-change"

export type VpnStatus = {
  show: boolean
  connected: boolean
}
