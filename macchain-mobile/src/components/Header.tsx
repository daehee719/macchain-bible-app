import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Ionicons } from '@expo/vector-icons'
import { useAuth } from '../contexts/AuthContext'

export type RootStackParamList = {
  Login: undefined
  Dashboard: undefined
  ReadingPlan: undefined
  AIAnalysis: undefined
  Community: undefined
  Statistics: undefined
  Settings: undefined
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>

const Header: React.FC = () => {
  const navigation = useNavigation<NavigationProp>()
  const { user, isLoggedIn, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { route: 'Dashboard' as const, label: '대시보드' },
    { route: 'ReadingPlan' as const, label: '읽기 계획' },
  ]

  const authNavLinks = isLoggedIn ? [
    { route: 'AIAnalysis' as const, label: 'AI 분석', icon: 'bulb' as const },
    { route: 'Community' as const, label: '커뮤니티', icon: 'people' as const },
    { route: 'Statistics' as const, label: '통계', icon: 'stats-chart' as const },
  ] : []

  const handleLogout = () => {
    logout()
    setMobileMenuOpen(false)
    navigation.navigate('Login')
  }

  return (
    <View style={styles.header}>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Dashboard')}
          style={styles.logoContainer}
        >
          <View style={styles.logoIcon}>
            <Ionicons name="book" size={24} color="#FFFFFF" />
          </View>
          <Text style={styles.logoText}>MacChain</Text>
        </TouchableOpacity>

        {/* Desktop Navigation - 모바일에서는 숨김 */}
        <View style={styles.desktopNav}>
          {navLinks.map((link) => (
            <TouchableOpacity
              key={link.route}
              onPress={() => navigation.navigate(link.route)}
              style={styles.navLink}
            >
              <Text style={styles.navLinkText}>{link.label}</Text>
            </TouchableOpacity>
          ))}
          {authNavLinks.map((link) => (
            <TouchableOpacity
              key={link.route}
              onPress={() => navigation.navigate(link.route)}
              style={styles.navLink}
            >
              <Ionicons name={link.icon} size={16} color="#374151" style={{ marginRight: 4 }} />
              <Text style={styles.navLinkText}>{link.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Auth Section */}
        <View style={styles.authSection}>
          {isLoggedIn ? (
            <>
              <TouchableOpacity
                onPress={() => navigation.navigate('Settings')}
                style={styles.iconButton}
              >
                <Ionicons name="settings" size={20} color="#374151" />
              </TouchableOpacity>
              <Text style={styles.userName}>
                {user?.name || user?.email}
              </Text>
              <TouchableOpacity
                onPress={handleLogout}
                style={styles.logoutButton}
              >
                <Ionicons name="log-out" size={18} color="#374151" style={{ marginRight: 4 }} />
                <Text style={styles.logoutText}>로그아웃</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
              style={styles.loginButton}
            >
              <Ionicons name="log-in" size={18} color="#FFFFFF" style={{ marginRight: 4 }} />
              <Text style={styles.loginButtonText}>로그인</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Mobile Menu Button */}
        <TouchableOpacity
          onPress={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={styles.mobileMenuButton}
        >
          <Ionicons 
            name={mobileMenuOpen ? 'close' : 'menu'} 
            size={24} 
            color="#374151" 
          />
        </TouchableOpacity>
      </View>

      {/* Mobile Menu Modal */}
      <Modal
        visible={mobileMenuOpen}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setMobileMenuOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>메뉴</Text>
              <TouchableOpacity
                onPress={() => setMobileMenuOpen(false)}
                style={styles.modalCloseButton}
              >
                <Ionicons name="close" size={24} color="#374151" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalNav}>
              {navLinks.map((link) => (
                <TouchableOpacity
                  key={link.route}
                  onPress={() => {
                    navigation.navigate(link.route)
                    setMobileMenuOpen(false)
                  }}
                  style={styles.modalNavLink}
                >
                  <Text style={styles.modalNavLinkText}>{link.label}</Text>
                </TouchableOpacity>
              ))}
              {authNavLinks.map((link) => (
                <TouchableOpacity
                  key={link.route}
                  onPress={() => {
                    navigation.navigate(link.route)
                    setMobileMenuOpen(false)
                  }}
                  style={styles.modalNavLink}
                >
                  <Ionicons name={link.icon} size={18} color="#374151" style={{ marginRight: 8 }} />
                  <Text style={styles.modalNavLinkText}>{link.label}</Text>
                </TouchableOpacity>
              ))}
              {isLoggedIn ? (
                <>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('Settings')
                      setMobileMenuOpen(false)
                    }}
                    style={styles.modalNavLink}
                  >
                    <Ionicons name="settings" size={18} color="#374151" style={{ marginRight: 8 }} />
                    <Text style={styles.modalNavLinkText}>설정</Text>
                  </TouchableOpacity>
                  <View style={styles.modalUserInfo}>
                    <Text style={styles.modalUserName}>
                      {user?.name || user?.email}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={handleLogout}
                    style={styles.modalNavLink}
                  >
                    <Ionicons name="log-out" size={18} color="#374151" style={{ marginRight: 8 }} />
                    <Text style={styles.modalNavLinkText}>로그아웃</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('Login')
                    setMobileMenuOpen(false)
                  }}
                  style={styles.modalLoginButton}
                >
                  <Text style={styles.modalLoginButtonText}>로그인</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    height: 64,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B5CF6',
  },
  desktopNav: {
    flexDirection: 'row',
    alignItems: 'center',
    display: 'none', // 모바일에서는 숨김
  },
  navLink: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  navLinkText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  authSection: {
    flexDirection: 'row',
    alignItems: 'center',
    display: 'none', // 모바일에서는 숨김
  },
  iconButton: {
    padding: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  userName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginRight: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#8B5CF6',
  },
  loginButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  mobileMenuButton: {
    padding: 8,
    borderRadius: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 40,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  modalCloseButton: {
    padding: 8,
  },
  modalNav: {
    paddingTop: 16,
  },
  modalNavLink: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalNavLinkText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  modalUserInfo: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalUserName: {
    fontSize: 14,
    color: '#6B7280',
  },
  modalLoginButton: {
    marginHorizontal: 20,
    marginTop: 16,
    paddingVertical: 16,
    borderRadius: 8,
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
  },
  modalLoginButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
})

export default Header

