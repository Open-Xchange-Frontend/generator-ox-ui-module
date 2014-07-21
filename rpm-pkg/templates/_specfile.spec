Name:           <%= packageName %>
BuildArch:      noarch
BuildRequires:  nodejs >= 0.10.0
Requires:	open-xchange-appsuite
Version:        <%= version %>
%define         ox_release 1
Release:        1
# use next line to run on a OBS instance
#Release:        %{ox_release}_<CI_CNT>.<B_CNT>
Group:          Applications/Productivity
Vendor:         Open-Xchange
URL:            http://open-xchange.com
Packager:       <%= maintainer %>
License:        <%= license %>
Summary:        <%= summary %>
Source:         %{name}_%{version}.orig.tar.gz
BuildRoot:      %{_tmppath}/%{name}-%{version}-root

%if 0%{?suse_version}
Requires:       apache2
%endif
%if 0%{?fedora_version} || 0%{?rhel_version}
Requires:       httpd
%endif

%if 0%{?rhel_version} || 0%{?fedora_version}
%define docroot /var/www/html/
%else
%define docroot /srv/www/htdocs/
%endif

%description
<%= description %>
<% if (staticFrontendPackage) { %>
%package static
Group:          Applications/Productivity
Summary:	Static files for <%= packageName %>

%description static
<%= description %>

This package contains static files to be installed on the web-server

<% } %>
%prep

%setup -q

%build

node -e "require('grunt').cli()" "" dist --no-color

%install
export NO_BRP_CHECK_BYTECODE_VERSION=true
APPSUITE=/opt/open-xchange/appsuite/
node -e "require('grunt').cli()" "" install:dist --prefix %{buildroot}/opt/open-xchange --htdoc %{buildroot}%{docroot} --no-color
find "%{buildroot}$APPSUITE" -type d | sed -e 's,%{buildroot},%dir ,' > %{name}.files
find "%{buildroot}$APPSUITE" \( -type f -o -type l \) | sed -e 's,%{buildroot},,' >> %{name}.files
<% if (staticFrontendPackage) { %>
find "%{buildroot}%{docroot}/appsuite" -type d | sed -e 's,%{buildroot},%dir ,' > %{name}-static.files
find "%{buildroot}%{docroot}/appsuite" \( -type f -o -type l \) | sed -e 's,%{buildroot},,' >> %{name}-static.files
<% } %>
%clean
%{__rm} -rf %{buildroot}

%files -f %{name}.files
%defattr(-,root,root)
%dir /opt/open-xchange
%exclude %{docroot}/*
<% if (staticFrontendPackage) { %>
%files static -f %{name}-static.files
%defattr(-,root,root)
<% } %>
