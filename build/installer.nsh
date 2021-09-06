!macro customInstall
  File /oname=$PLUGINSDIR\mariadb.msi "${BUILD_RESOURCES_DIR}\mariabd.msi"
  ExecWait '"msiexec" /i "$PLUGINSDIR\mariadb.msi" [INSTALLDIR=%ProgramFiles%\AdminStudent PORT=36 PASSWORD=uxrlrpaqga9lfe9l SERVICENAME=AdminStudent DATADIR=INSTALLDIR\ REMOVE=HeidiSQL] /qn' 
!macroend