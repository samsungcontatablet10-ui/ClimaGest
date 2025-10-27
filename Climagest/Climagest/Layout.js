import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  LayoutDashboard, 
  Package, 
  Wrench, 
  FileText, 
  DollarSign,
  QrCode,
  Menu,
  X,
  Bell,
  User,
  Smartphone,
  CalendarCheck,
  Users,
  TrendingUp,
  Calendar
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";

const navigationItems = [
  {
    title: "Painel de Controle",
    url: createPageUrl("Dashboard"),
    icon: LayoutDashboard,
  },
  {
    title: "Ativos",
    url: createPageUrl("Ativos"),
    icon: Package,
  },
  {
    title: "Ordens de Serviço",
    url: createPageUrl("OrdensServico"),
    icon: Wrench,
  },
  {
    title: "Planejamento Sistemático",
    url: createPageUrl("Planejamento"),
    icon: CalendarCheck,
  },
  {
    title: "Plano Sistemático 2026",
    url: createPageUrl("PlanoSistematico2026"),
    icon: Calendar,
  },
  {
    title: "Inventário Rápido",
    url: createPageUrl("Inventario"),
    icon: QrCode,
  },
  {
    title: "Relatórios Financeiros",
    url: createPageUrl("RelatoriosFinanceiros"),
    icon: DollarSign,
  },
  {
    title: "Desempenho Técnicos",
    url: createPageUrl("DesempenhoTecnicos"),
    icon: Users,
  },
  {
    title: "Técnico Mobile",
    url: createPageUrl("TecnicoMobile"),
    icon: Smartphone,
  },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: ordensServico } = useQuery({
    queryKey: ['ordensServico'],
    queryFn: () => base44.entities.OrdemServico.list(),
    initialData: [],
  });

  const osPendentes = ordensServico.filter(os => 
    os.status === 'pendente' || os.status === 'em_andamento'
  ).length;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
        <Sidebar className="border-r border-slate-200 bg-white/80 backdrop-blur-lg">
          <SidebarHeader className="border-b border-slate-200 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-lg">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900 text-lg">GAC</h2>
                <p className="text-xs text-slate-500">Gestão de Ativos</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-3">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2">
                Navegação
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        className={`hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 rounded-xl mb-1 ${
                          location.pathname === item.url ? 'bg-blue-50 text-blue-700 font-medium' : ''
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3 px-4 py-3">
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {osPendentes > 0 && (
              <SidebarGroup>
                <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2">
                  Notificações
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <div className="px-3 py-2">
                    <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-orange-600" />
                        <span className="text-sm font-medium text-orange-900">
                          {osPendentes} OS Pendentes
                        </span>
                      </div>
                    </div>
                  </div>
                </SidebarGroupContent>
              </SidebarGroup>
            )}
          </SidebarContent>

          <SidebarFooter className="border-t border-slate-200 p-4">
            <div className="flex items-center gap-3 px-2">
              <div className="w-10 h-10 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-slate-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-900 text-sm truncate">
                  {user?.full_name || 'Usuário'}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  {user?.email || 'Sistema GAC'}
                </p>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="bg-white/80 backdrop-blur-lg border-b border-slate-200 px-6 py-4 md:hidden sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-slate-100 p-2 rounded-lg transition-colors duration-200" />
              <h1 className="text-lg font-bold text-slate-900">GAC</h1>
              {osPendentes > 0 && (
                <Badge className="ml-auto bg-orange-500">{osPendentes} OS</Badge>
              )}
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}