!macro customInstall
  File /oname=$PLUGINSDIR\mariadb.msi "${BUILD_RESOURCES_DIR}\mariabd.msi"
  ExecWait '"msiexec" /i "$PLUGINSDIR\mariadb.msi" [INSTALLDIR=%ProgramFiles% PORT=36] /qn' 
!macroend