'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/app/ui/button2';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/app/ui/form';
import { Input } from '@/app/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/ui/select';
import { Slider } from '@/app/ui/slider';
import { Checkbox } from '@/app/ui/checkbox';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/app/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/app/ui/dialog2';
import { UserCircle, Plus, Edit2 } from 'lucide-react';
import Navbar from '@/app/ui/Navbar';

const formSchema = z.object({
    nombre: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres.' }),
    sexo: z.enum(['hombre', 'mujer', 'no_especificar'], { required_error: 'Por favor selecciona una opción.' }),
    ejercicio: z.enum(['0-2', '3-5', '6+'], { required_error: 'Por favor selecciona una opción.' }),
    peso: z.number().min(30, { message: 'El peso mínimo es 30 kg.' }).max(300, { message: 'El peso máximo es 300 kg.' }),
    altura: z.number().min(100, { message: 'La altura mínima es 100 cm.' }).max(250, { message: 'La altura máxima es 250 cm.' }),
    fechaNacimiento: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Formato de fecha inválido. Use YYYY-MM-DD.' }),
    metaPeso: z.number().min(30, { message: 'El peso mínimo es 30 kg.' }).max(300, { message: 'El peso máximo es 300 kg.' }),
    velocidad: z.number().min(0.1, { message: 'La velocidad mínima es 0.1 kg/semana.' }).max(1.5, { message: 'La velocidad máxima es 1.5 kg/semana.' }),
    impedimentos: z.array(z.string()).refine((value) => value.some((item) => item), { message: 'Selecciona al menos una opción.' }),
    dieta: z.enum(['clasica', 'pescados', 'vegetariano', 'vegano'], { required_error: 'Por favor selecciona una opción.' }),
    metas: z.array(z.string()).refine((value) => value.some((item) => item), { message: 'Selecciona al menos una opción.' }),
});

type Profile = z.infer<typeof formSchema>;

const defaultProfile: Profile = {
    nombre: '',
    sexo: 'no_especificar',
    ejercicio: '0-2',
    peso: 70,
    altura: 170,
    fechaNacimiento: '',
    metaPeso: 65,
    velocidad: 0.5,
    impedimentos: [],
    dieta: 'clasica',
    metas: [],
};

export default function Perfil() {
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const form = useForm<Profile>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultProfile,
    });

    useEffect(() => {
        async function fetchProfiles() {
            const response = await fetch('/api/getProfiles');
            const data = await response.json();
            setProfiles(data);
        }
        fetchProfiles();
    }, []);

    async function onSubmit(values: Profile) {
        try {
            const response = await fetch('/api/saveProfile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            if (response.ok) {
                const newProfile = await response.json();
                setProfiles([...profiles, newProfile]);
                setIsDialogOpen(false);
                setEditingProfile(null);
                form.reset(defaultProfile);
            } else {
                console.error('Error saving profile');
            }
        } catch (error) {
            console.error('Error saving profile:', error);
        }
    }

    function openEditDialog(profile: Profile) {
        setEditingProfile(profile);
        form.reset(profile);
        setIsDialogOpen(true);
    }

    return (
        <main className="flex flex-col items-center bg-bpwhite min-h-screen pb-20">
            <div className="flex flex-col w-full text-white items-center sticky gap-2 top-0 bg-gray-800 p-4 bg-[#4CCD99]">
                <div className="flex relative w-full justify-center items-center text-spwhite gap-2 p-4">
                    <UserCircle className="w-8 h-8" />
                    <p className="text-center text-[28px] font-semibold leading-10">Perfiles</p>
                </div>
            </div>

            <div className="flex flex-col w-full max-w-md p-5 gap-4">
                {profiles.map((profile, index) => (
                    <Card key={index} className="w-full bg-white text-black">
                        <CardHeader>
                            <CardTitle>{profile.nombre}</CardTitle>
                            <CardDescription>Perfil {index + 1}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>Sexo: {profile.sexo}</p>
                            <p>Ejercicio semanal: {profile.ejercicio} veces</p>
                            <p>Peso actual: {profile.peso} kg</p>
                            <p>Altura: {profile.altura} cm</p>
                            <p>Meta de peso: {profile.metaPeso} kg</p>
                        </CardContent>
                        <CardFooter>
                            <Button onClick={() => openEditDialog(profile)}>
                                <Edit2 className="mr-2 h-4 w-4" /> Editar
                            </Button>
                        </CardFooter>
                    </Card>
                ))}

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="w-full text-[#4CCD99]">
                            <Plus className="mr-2 h-4 w-4 text-[#4CCD99]" /> Agregar Perfil
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] mx-auto my-8 p-6 rounded-lg shadow-lg max-h-[80vh] overflow-y-auto bg-white text-black">
                    <DialogHeader>
                            <DialogTitle>{editingProfile ? 'Editar Perfil' : 'Nuevo Perfil'}</DialogTitle>
                            <DialogDescription>
                                {editingProfile ? 'Modifica los datos del perfil aquí.' : 'Ingresa los datos para el nuevo perfil.'}
                            </DialogDescription>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <FormField
                                    control={form.control}
                                    name="nombre"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nombre</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Tu nombre" {...field} className="text-black" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="sexo"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Sexo</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecciona tu sexo" className="text-black" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="hombre">Hombre</SelectItem>
                                                    <SelectItem value="mujer">Mujer</SelectItem>
                                                    <SelectItem value="no_especificar">No especificar</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="ejercicio"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>¿Cuánto ejercicio haces a la semana?</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecciona la frecuencia de ejercicio" className="text-black" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="0-2">0-2 veces</SelectItem>
                                                    <SelectItem value="3-5">3-5 veces</SelectItem>
                                                    <SelectItem value="6+">6+ veces</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="peso"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Peso (kg)</FormLabel>
                                            <FormControl>
                                                <Input type="number" {...field} className="text-black" onChange={(e) => field.onChange(parseFloat(e.target.value))} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="altura"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Altura (cm)</FormLabel>
                                            <FormControl>
                                                <Input type="number" {...field} className="text-black"   onChange={(e) => field.onChange(parseFloat(e.target.value))} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="fechaNacimiento"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Fecha de nacimiento</FormLabel>
                                            <FormControl>
                                                <Input type="date" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="metaPeso"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Meta de peso (kg)</FormLabel>
                                            <FormControl>
                                                <Input type="number" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value))} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="velocidad"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Velocidad de pérdida de peso (kg/semana)</FormLabel>
                                            <FormControl>
                                                <Slider
                                                    min={0.1}
                                                    max={1.5}
                                                    step={0.1}
                                                    value={[field.value]}
                                                    onValueChange={(value) => field.onChange(value[0])}
                                                />
                                            </FormControl>
                                            <FormDescription>{field.value} kg/semana</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="impedimentos"
                                    render={() => (
                                        <FormItem>
                                            <FormLabel>¿Qué te impide actualmente alcanzar tus metas?</FormLabel>
                                            <div className="space-y-2">
                                                {[
                                                    { value: 'falta_consistencia', label: 'Falta de consistencia' },
                                                    { value: 'habitos_no_saludables', label: 'Hábitos alimenticios no saludables' },
                                                    { value: 'falta_apoyo', label: 'Falta de apoyo' },
                                                    { value: 'horario_ocupado', label: 'Horario ocupado' },
                                                    { value: 'falta_inspiracion', label: 'Falta de inspiración en platillos' },
                                                ].map((item) => (
                                                    <FormField
                                                        key={item.value}
                                                        control={form.control}
                                                        name="impedimentos"
                                                        render={({ field }) => (
                                                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                                                <FormControl>
                                                                    <Checkbox
                                                                        checked={field.value?.includes(item.value)}
                                                                        onCheckedChange={(checked) => {
                                                                            const updatedValue = checked
                                                                                ? [...field.value, item.value]
                                                                                : field.value?.filter((value) => value !== item.value);
                                                                            field.onChange(updatedValue);
                                                                        }}
                                                                    />
                                                                </FormControl>
                                                                <FormLabel className="font-normal">{item.label}</FormLabel>
                                                            </FormItem>
                                                        )}
                                                    />
                                                ))}
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="dieta"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>¿Sigues alguna dieta específica?</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecciona tu dieta" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="clasica">Clásica</SelectItem>
                                                    <SelectItem value="pescados">De pescados (carnes blancas)</SelectItem>
                                                    <SelectItem value="vegetariano">Vegetariano</SelectItem>
                                                    <SelectItem value="vegano">Vegano</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="metas"
                                    render={() => (
                                        <FormItem>
                                            <FormLabel>¿Qué te gustaría lograr?</FormLabel>
                                            <div className="space-y-2">
                                                {[
                                                    { value: 'comer_saludable', label: 'Comer y vivir más saludable' },
                                                    { value: 'mas_energia', label: 'Tener más energía y mejor actitud' },
                                                    { value: 'mantener_motivacion', label: 'Mantenerme motivado y consistente' },
                                                    { value: 'mejor_cuerpo', label: 'Sentirme mejor sobre mi cuerpo' },
                                                ].map((item) => (
                                                    <FormField
                                                        key={item.value}
                                                        control={form.control}
                                                        name="metas"
                                                        render={({ field }) => (
                                                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                                                <FormControl>
                                                                    <Checkbox
                                                                        checked={field.value?.includes(item.value)}
                                                                        onCheckedChange={(checked) => {
                                                                            const updatedValue = checked
                                                                                ? [...field.value, item.value]
                                                                                : field.value?.filter((value) => value !== item.value);
                                                                            field.onChange(updatedValue);
                                                                        }}
                                                                    />
                                                                </FormControl>
                                                                <FormLabel className="font-normal">{item.label}</FormLabel>
                                                            </FormItem>
                                                        )}
                                                    />
                                                ))}
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <DialogFooter>
                                    <Button type="submit">{editingProfile ? 'Guardar Cambios' : 'Crear Perfil'}</Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>
            <div className="flex justify-center fixed bottom-0 z-50 w-full">
                <Navbar selected="Perfil"/>
            </div>
        </main>
    );
}