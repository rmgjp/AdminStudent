!macro customInstall
  File /oname=$PLUGINSDIR\extramsi.msi "${BUILD_RESOURCES_DIR}\extramsi.msi"
  ExecWait '"msiexec" /i "$PLUGINSDIR\extramsi.msi" /passive'
!macroend