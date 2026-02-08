import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function SellerPanel() {
  return (
    <Tabs defaultValue="products" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="products">My Products</TabsTrigger>
        <TabsTrigger value="settings">Payment Settings</TabsTrigger>
      </TabsList>
      
      <TabsContent value="products">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
                <div>
                    <CardTitle>Products</CardTitle>
                    <CardDescription>Manage your skills listed on the marketplace.</CardDescription>
                </div>
                <Button>+ New Product</Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm text-muted-foreground p-4 text-center border border-dashed rounded-md">
                No products listed yet. Start selling!
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="settings">
        <Card>
          <CardHeader>
            <CardTitle>Crypto Payment</CardTitle>
            <CardDescription>Configure where you receive funds (USDT/USDC).</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="wallet">Wallet Address (TRC20 / ERC20)</Label>
              <Input id="wallet" placeholder="0x..." />
            </div>
            <div className="space-y-1">
              <Label htmlFor="qr">QR Code URL</Label>
              <Input id="qr" type="file" />
            </div>
            <Button>Save Settings</Button>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
